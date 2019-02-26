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
REQUEST_INTERVAL = 1 # in seconds

class ImageType(Enum):
  SERVANT_ICON = 1
  CLASS_ICON = 2
  SERVANT_PORTRAIT = 3

class Servant:
  def __init__(self, id: int, icon_url: str, english_name: str, japanese_name: str, class_url: str,
    stage_one_url: str):
    self.id = id
    self.icon_url = icon_url
    self.english_name = english_name
    self.japanese_name = japanese_name
    self.class_url = class_url
    # self.rarity = rarity
    # min atk? max atk? min hp? max hp?
    # command cards? np card?
    # obtained?
    self.stage_one_url = stage_one_url

def scrape_servants():
  servant_list = list()

  servant_list_url = DOMAIN + SERVANT_LIST_PATH
  response = requests.get(servant_list_url, headers=HEADERS)

  if (response.status_code != OK):
    print('HTTP request failed.\nStatus code:', response.status_code)
    return

  print('HTTP request succeeded. Parsing...')
  html = response.text
  soup = BeautifulSoup(html, 'html.parser')

  table = soup.find('table', {'class': 'sortable'})

  # start at 1 to skip header
  for tr in table.find_all('tr')[1:]:
    tds = tr.find_all('td')
    id = _get_id(tds[0])
    print('Parsing Servant ' + str(id))

    icon_url = _get_img_src(tds[1])
    icon_filename = icon_url.split('/')[-1]
    local_icon_url = ROOT_IMAGES_DIR + SERVANT_ICONS_DIR + icon_filename
    _save_image_locally(icon_url, icon_filename, ImageType.SERVANT_ICON)

    names = _get_names(tds[2])
    english_name = names[0]
    japanese_name = names[1]

    class_url = _get_img_src(tds[3])
    class_filename = class_url.split('/')[-1]
    local_class_url = ROOT_IMAGES_DIR + CLASS_ICONS_DIR + class_filename
    _save_image_locally(class_url, class_filename, ImageType.CLASS_ICON)

    servant_url = _get_a_href(tds[1])
    response = requests.get(servant_url, headers=HEADERS)
    time.sleep(REQUEST_INTERVAL)

    if (response.status_code != OK):
      print('HTTP request failed.\nStatus code:', response.status_code)
      local_stage_one_url = ''
    else:
      html = response.text
      soup = BeautifulSoup(html, 'html.parser')

      first = soup.find('div', {'title': '1st'})
      stage_one_url = _get_img_src(first)
      stage_one_filename = stage_one_url.split('/')[-1]
      local_stage_one_url = ROOT_IMAGES_DIR + SERVANT_PORTRAITS_DIR + stage_one_filename
      _save_image_locally(stage_one_url, stage_one_filename, ImageType.SERVANT_PORTRAIT)

    servant = Servant(id, local_icon_url, english_name, japanese_name, local_class_url,
      local_stage_one_url)
    servant_list.append(servant)

  mongolab_uri = os.environ.get('MONGOLAB_URI')
  client = MongoClient(mongolab_uri)
  db = client.myservantlist
  servants = db.servants

  print('Sending to database...')
  for servant in servant_list:
    id = servant.id
    icon_url = servant.icon_url
    english_name = servant.english_name
    japanese_name = servant.japanese_name
    class_url = servant.class_url

    stage_one_url = servant.stage_one_url
    filter = {'id': id}
    set = {'icon_url': icon_url, 'english_name': english_name, 'japanese_name': japanese_name, 'class_url': class_url,
      'stage_one_url': stage_one_url}
    update = {'$set': set}
    servants.update_one(filter, update, upsert=True)

  client.close()

def _get_id(td: BeautifulSoup) -> int:
  id = int(td.string)
  return id

def _get_img_src(td: BeautifulSoup) -> str:
  img = td.find('img')
  thumb = img['src']
  src = _thumb_to_src(thumb)
  return DOMAIN + src

def _get_a_href(td: BeautifulSoup) -> str:
  a = td.find('a')
  href = a['href']
  return DOMAIN + href

def _get_names(td: BeautifulSoup) -> list:
  strings = td.stripped_strings
  return [string for string in strings]

def _thumb_to_src(thumb: str) -> str:
  pattern = r'/images/thumb/(.+)/(.+)/(.+)/.+'
  match = re.match(pattern, thumb)
  if match:
    return f'/images/{match[1]}/{match[2]}/{match[3]}'
  else:
    return ''

def _save_image_locally(scrape_url: str, filename: str, image_type: ImageType) -> None:
  if (image_type == ImageType.SERVANT_ICON):
    file_path = SCRIPT_IMAGES_DIR + SERVANT_ICONS_DIR + filename
  elif (image_type == ImageType.CLASS_ICON):
    file_path = SCRIPT_IMAGES_DIR + CLASS_ICONS_DIR + filename
  elif (image_type == ImageType.SERVANT_PORTRAIT):
    file_path = SCRIPT_IMAGES_DIR + SERVANT_PORTRAITS_DIR + filename
  else:
    return

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