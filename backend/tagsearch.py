import json

#this is where the directory is
#this will read from conf file later
directory = raw_input("directory: ")
#where the dicionary data should be logged
dataLog = raw_input("log folder: ")
#uses raw_input() for now, but can be removed later
tag = raw_input("tag: ").lower()
#length of tag
tagLen = len(tag)
print
#loads data from data.json file
with open(str(dataLog + "/" + 'data.json'), 'r') as fp:
    tagIndex = json.load(fp)
#tagIndex[0] is the keys of the dictionary
#tagIndex[1] has the values of the dictionary

#loop
for i in xrange(0,len(tagIndex[0])):
    if tag == str(tagIndex[0][i][0:tagLen]):
        #print the name of the parts
        print tagIndex[1][i]
