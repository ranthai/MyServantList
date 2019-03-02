import requests
import shutil
from bs4 import BeautifulSoup
from pymongo import MongoClient
import os
import re
import time
from enum import Enum

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
SERVANT_PORTRAITS_DIR = 'portraits/servants/'

# http status
OK = 200

# request settings
HEADERS = {"Accept-Encoding": "gzip"}
REQUEST_INTERVAL = .5 # in seconds

def scrape_servants():
  servant_list_url = DOMAIN + SERVANT_LIST_PATH
  response = requests.get(servant_list_url, headers=HEADERS)

  if (response.status_code != OK):
    print('HTTP request failed.\nStatus code:', response.status_code)
    return

  print('HTTP request succeeded. Parsing...')
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

def parse_servants(html: str) -> list(dict()):
  servant_list = list()
  soup = BeautifulSoup(html, 'html.parser')

  table = soup.find('table', {'class': 'sortable'})
  # start at 1 to skip header
  for tr in table.find_all('tr')[1:]:
    servant = dict()
    tds = tr.find_all('td')
    id = _get_id(tds[0])
    servant['id'] = id
    print('Parsing Servant ' + str(id))

    servant['icon_url'] = _create_local_image(tds[1], SERVANT_ICONS_DIR)

    names = _get_names(tds[2])
    servant['english_name'] = names[0]
    servant['japanese_name'] = names[1]

    servant['category'] = _get_category(tds[2])
    servant['class_url'] = _create_local_image(tds[3], CLASS_ICONS_DIR)

    servant_url = _get_servant_url(tds[1])
    response = requests.get(servant_url, headers=HEADERS)
    time.sleep(REQUEST_INTERVAL)

    if (response.status_code != OK):
      print('HTTP request failed.\nStatus code:', response.status_code)
    else:
      html = response.text
      soup = BeautifulSoup(html, 'html.parser')

      first = soup.find('div', {'title': '1st'})
      servant['stage_one_url'] = _create_local_image(first, SERVANT_PORTRAITS_DIR)
      # event servants have no 2nd or 3rd stage art (except saber lily)
      # enemy servants have no 2nd, 3rd, or 4th stage art
      second = soup.find('div', {'title': '2nd'})
      if (second != None):
        servant['stage_two_url'] = _create_local_image(second, SERVANT_PORTRAITS_DIR)
      third = soup.find('div', {'title': '3rd'})
      if (third != None):
        servant['stage_three_url'] = _create_local_image(third, SERVANT_PORTRAITS_DIR)
      fourth = soup.find('div', {'title': '4th'})
      if (fourth != None):
        servant['stage_four_url'] = _create_local_image(fourth, SERVANT_PORTRAITS_DIR)

    servant_list.append(servant)

  return servant_list

def _get_id(bs: BeautifulSoup) -> int:
  id = int(bs.string)
  return id

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

def _get_names(bs: BeautifulSoup) -> list:
  strings = bs.stripped_strings
  return [string for string in strings]

def _thumb_to_src(thumb: str) -> str:
  pattern = r'/images/thumb/(.+)/(.+)/(.+)/.+'
  match = re.match(pattern, thumb)
  if match:
    return f'/images/{match[1]}/{match[2]}/{match[3]}'
  else:
    return ''

def _create_local_image(bs: BeautifulSoup, subdir: str) -> str:
  url = _get_img_src(bs)
  filename = url.split('/')[-1]
  _save_image_locally(url, filename, subdir)
  return ROOT_IMAGES_DIR + subdir + filename

def _save_image_locally(scrape_url: str, filename: str, subdir: str) -> None:
  file_path = SCRIPT_IMAGES_DIR + subdir + filename
  if (os.path.isfile(file_path)):
    return

  response = requests.get(scrape_url, headers=HEADERS, stream=True)

  if (response.status_code != OK):
    print('HTTP request failed.\nStatus code:', response.status_code)
    return
  else:
    with open(file_path, 'wb') as f:
      response.raw.decode_content = True
      shutil.copyfileobj(response.raw, f)
  time.sleep(REQUEST_INTERVAL)

if __name__ == "__main__":
  scrape_servants()