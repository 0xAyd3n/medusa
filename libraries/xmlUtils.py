import os
import xml.etree.ElementTree as tree

RED   = "\033[1;31m"  
BLUE  = "\033[1;34m"
CYAN  = "\033[1;36m"
GREEN = "\033[0;32m"
RESET = "\033[0;0m"
BOLD    = "\033[;1m"
REVERSE = "\033[;7m"

# etree.register_namespace('android', 'http://schemas.android.com/apk/res/android')


def get_elements(xmlDoc,node,attrib):
    node = xmlDoc.getElementsByTagName(node)
   
    for  atr in node:
        return atr.getAttribute(attrib)

def get_elements_sub(xmlDoc):

    manifest = tree.parse(xmlDoc)
    root = manifest.getroot()
    broadcasts = []
    for child in root.iter():
        if child.tag == 'intent-filter':
            for action in child:
                broadcasts.append( action.get("{http://schemas.android.com/apk/res/android}name"))
  
    return broadcasts

def parse_strings_xml(xmlDoc):
    try:
        stringsXML = tree.parse(xmlDoc)
        root = stringsXML.getroot()
        strings = []
        for child in root.iter():        
            if child.tag=='string':
                attrib = child.attrib['name']
                text = child.text
                if attrib is not None and text is not None:
                    strings.append(attrib+"="+text)
    except Exception as e:
        print(e) 
    return strings


def get_element_list(xmlDoc,node,attrib):
    elements = []
    nod = xmlDoc.getElementsByTagName(node)
   
    for  atr in nod:

        elements.append(atr.getAttribute(attrib))
        if 'true' in atr.getAttribute("android:exported"):
            print(RED + '{:10}'.format(node)+'{:80}'.format(atr.getAttribute(attrib)) + CYAN+' is exported')

       
    
    return elements


def get_deeplinks(xmlDoc,activity,node,attrib):
    
    deeplinksTree = {}
    deeplinks = []
    for act in xmlDoc.getElementsByTagName(activity):
        deeplinks = get_deeplinks_s(act,'data','android:scheme')
        if deeplinks:
            deeplinksTree[act.getAttribute('android:name')] = deeplinks
    
    return deeplinksTree



def get_deeplinks_s(xmlDoc,node,attrib):
    deeplinks = []
    nod = xmlDoc.getElementsByTagName(node)
    attribfinal = ''

    for atr in nod:
  
        attribfinal = atr.getAttribute(attrib)+'://'
        host= atr.getAttribute("android:host")
        pathPrefix = atr.getAttribute("android:pathPrefix")

        if host != '':
            attribfinal = attribfinal  + host
        if pathPrefix != '':
            attribfinal = attribfinal  + pathPrefix

        deeplinks.append(attribfinal)
    return deeplinks

    

