import requests
import shutil
from bs4 import BeautifulSoup
from pymongo import MongoClient
import os
import re
import time
from enum import Enum
import urllib
import sys

# urls
DOMAIN = 'https://grandorder.wiki'
SERVANT_LIST_PATH = '/Servant_List'

# images directory relative to website root
# used to identify where images will be served from
ROOT_IMAGES_DIR = '/images/'
# images directory relative to this scrape script
# used to identify where to store the images
SCRIPT_IMAGES_DIR = '../public/images/'
# subdirectories
SERVANT_ICONS_DIR = 'icons/servants/'
CLASS_ICONS_DIR = 'icons/classes/'
ITEM_ICONS_DIR = 'icons/items/'
SERVANT_PORTRAITS_DIR = 'portraits/servants/'

# http status
OK = 200

# request settings
HEADERS = {"Accept-Encoding": "gzip"}
REQUEST_INTERVAL = 0 # in seconds

def scrape_servants():
  servant_list_url = DOMAIN + SERVANT_LIST_PATH
  response = requests.get(servant_list_url, headers=HEADERS)

  if (response.status_code != OK):
    print(f'HTTP request for {servant_list_url} failed.\nStatus code:', response.status_code)
    return

  print(f'HTTP request succeeded. Parsing {servant_list_url}')
  html = response.text
  servant_list = parse_servants(html)

  mongolab_uri = os.environ.get('MONGOLAB_URI')
  client = MongoClient(mongolab_uri)
  db = client.myservantlist
  servants = db.servants

  print('Sending to database...')
  for servant in servant_list:
    filter = {'id': servant['id']}
    set = servant
    update = {'$set': set}
    servants.update_one(filter, update, upsert=True)

  client.close()
  print('Done.')

def parse_servants(html: str) -> list(dict()):
  servant_list = list()

  soup = BeautifulSoup(html, 'html.parser')
  table = soup.find('table', {'class': 'sortable'})
  # start at 1 to skip header
  for tr in table.find_all('tr')[1:]:
    tds = tr.find_all('td')

    servant_url = _get_servant_url(tds[1])
    response = requests.get(servant_url, headers=HEADERS)
    time.sleep(REQUEST_INTERVAL)

    if (response.status_code != OK):
      print(f'HTTP request for {servant_url} failed.\nStatus code:', response.status_code)
    else:
      print(f'HTTP request succeeded. Parsing {servant_url}')

      html = response.text
      servant = parse_servant(html)
      # some servants don't have an icon on their page, so grab it from the list page instead
      servant['servant_icon_url'] = _create_local_image(tds[1], SERVANT_ICONS_DIR)

      servant_list.append(servant)

  return servant_list

def parse_servant(html: str):
  servant = dict()

  soup = BeautifulSoup(html, 'html.parser')
  table = soup.find('table', {'class': 'wikitable borderless'})
  trs = table.find_all('tr')

  divs = trs[0].find_all('div')

  servant['id'] = _get_id(divs[0])
  servant['rarity'] = _get_rarity(divs[0])

  a = divs[1].find('a')
  # most class icons have links to their corresponding class
  # angra mainyu and solomon don't, so we have to parse their img instead
  if (a):
    servant['class'] = a['title']
  else:
    img = divs[1].find('img')
    servant['class'] = _get_class(img['alt'])
  servant['class_icon_url'] = _create_local_image(divs[1], CLASS_ICONS_DIR)

  servant['english_name'] = _get_stripped_text(divs[2])
  category = _get_category(divs[1])
  if (category):
    servant['category'] = category

  servant['japanese_name'] = _get_stripped_text(divs[3])

  first = trs[1].find('div', {'title': '1st'})
  servant['servant_portrait_one_url'] = _create_local_image(first, SERVANT_PORTRAITS_DIR)
  # event servants have no 2nd or 3rd stage art (except saber lily)
  # enemy servants have no 2nd, 3rd, or 4th stage art
  second = trs[1].find('div', {'title': '2nd'})
  if (second):
    servant['servant_portrait_two_url'] = _create_local_image(second, SERVANT_PORTRAITS_DIR)
  third = trs[1].find('div', {'title': '3rd'})
  if (third):
    servant['servant_portrait_three_url'] = _create_local_image(third, SERVANT_PORTRAITS_DIR)
  fourth = trs[1].find('div', {'title': '4th'})
  if (fourth):
    servant['servant_portrait_four_url'] = _create_local_image(fourth, SERVANT_PORTRAITS_DIR)

  ascensions_dict = _parse_ascension_table(soup)
  if (ascensions_dict):
    servant['ascensions'] = ascensions_dict

  skill_reinforcement_dict = _parse_skill_reinforcement_table(soup)
  if (skill_reinforcement_dict):
    servant['skill_reinforcements'] = skill_reinforcement_dict

  return servant

def _parse_ascension_table(bs: BeautifulSoup) -> dict:
  # enemy servants have no ascension
  headline = bs.find('span', {'id': 'Ascension'})
  if (headline != None):
    ascensions_dict = dict()
    # first sibling is newline
    table = headline.parent.next_sibling.next_sibling
    for tr in table.find_all('tr')[1:]:
      th = tr.find('th')
      if (th != None):
        level = _get_stripped_text(th)

        tds = tr.find_all('td')
        ascension_list = _get_items(tds[1])
        ascension_list.append(_get_qp(tds[0]))
      else:
        # mash is special
        tds = tr.find_all('td')
        level = _get_stripped_text(tds[0])

        ascension_list = [{'condition': _get_stripped_text(tds[1])}]
      ascensions_dict[level] = ascension_list
    return ascensions_dict
  else:
    return None

def _parse_skill_reinforcement_table(bs: BeautifulSoup) -> dict:
  # enemy servants have no ascension
  headline = bs.find('span', {'id': 'Skill_Reinforcement'})
  if (headline != None):
    skill_reinforcement_dict = dict()
    # first sibling is newline
    table = headline.parent.next_sibling.next_sibling
    for tr in table.find_all('tr')[1:]:
      th = tr.find('th')
      level = _get_stripped_text(th)

      tds = tr.find_all('td')
      skill_reinforcement_list = _get_items(tds[1])
      skill_reinforcement_list.append(_get_qp(tds[0]))
      skill_reinforcement_dict[level] = skill_reinforcement_list
    return skill_reinforcement_dict
  else:
    return None

def _get_id(bs: BeautifulSoup) -> int:
  span = bs.find('span', {'data-simple-tooltip': 'ID'})
  text = _get_stripped_text(span)
  return int(text)

def _get_rarity(bs: BeautifulSoup) -> int:
  span = bs.find('span', {'data-simple-tooltip': 'Rarity'})
  text = _get_stripped_text(span)
  return int(text[0])

# this won't work for every servant
# ex: mash's is icon class shielder silver.png
def _get_class(alt: str) -> str:
  pattern = r'Icon Class (.*)\..*'
  match = re.match(pattern, alt)
  if match:
    return match[1].strip()
  else:
    return alt

def _get_img_src(bs: BeautifulSoup) -> str:
  img = bs.find('img')
  thumb = img['src']
  src = _thumb_to_src(thumb)
  return DOMAIN + src

def _get_category(bs: BeautifulSoup) -> str:
  a = bs.find_all('a')
  if (len(a) > 1):
    return a[1]['title']
  else:
    return ''

def _get_servant_url(bs: BeautifulSoup) -> str:
  a = bs.find('a')
  href = a['href']
  return DOMAIN + href

def _thumb_to_src(thumb: str) -> str:
  pattern = r'/images/thumb/(.+)/(.+)/(.+)/.+'
  match = re.match(pattern, thumb)
  if match:
    return f'/images/{match[1]}/{match[2]}/{match[3]}'
  else:
    return thumb

def _create_local_image(bs: BeautifulSoup, subdir: str) -> str:
  url = _get_img_src(bs)
  filename = url.split('/')[-1]
  decoded_filename = urllib.parse.unquote(filename)
  _save_image_locally(url, decoded_filename, subdir)
  return ROOT_IMAGES_DIR + subdir + decoded_filename

def _save_image_locally(scrape_url: str, filename: str, subdir: str) -> None:
  file_path = SCRIPT_IMAGES_DIR + subdir + filename
  if (os.path.isfile(file_path)):
    return

  response = requests.get(scrape_url, headers=HEADERS, stream=True)
  if (response.status_code != OK):
    print(f'HTTP request for {scrape_url} failed.\nStatus code:', response.status_code)
    return
  else:
    with open(file_path, 'wb') as f:
      response.raw.decode_content = True
      shutil.copyfileobj(response.raw, f)
  time.sleep(REQUEST_INTERVAL)

def _get_qp(bs: BeautifulSoup) -> dict():
  qp = dict()
  qp['name'] = 'QP'
  # qp image doesn't show up on the screens we scrape
  # so i hardcoded this lol.
  _save_image_locally('https://grandorder.wiki/images/1/11/Icon_Item_QP.png', 'Icon_Item_QP.png', ITEM_ICONS_DIR)
  qp['url'] = ROOT_IMAGES_DIR + ITEM_ICONS_DIR + 'Icon_Item_QP.png'
  qp['count'] = bs.find('div').get_text()
  return qp

def _get_items(bs: BeautifulSoup) -> list:
  items = list()
  item_style = 'display:inline-block;position:relative;margin-right:5px'
  for div in bs.find_all('div', {'style': item_style}):
    a = div.find('a')
    # some cells have an empty div at the end
    if (a != None) :
      item = dict()
      item['name'] = a['title']
      item['url'] = _create_local_image(div, ITEM_ICONS_DIR)
      count_str = div.get_text()
      if (count_str != ''):
        item['count'] = count_str
      else:
        item['count'] = '1'

      items.append(item)
  return items

def _get_stripped_text(bs:BeautifulSoup) -> str:
  return bs.get_text().strip()

if __name__ == '__main__':
  scrape_servants()