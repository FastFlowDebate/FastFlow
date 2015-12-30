import os
import json
'''
searches through a folder for files with tags, and compiles them for better indexing
'''

#this is where the directory is
#this will read from conf file later
directoryPath = raw_input("directory: ")
#where the dicionary data should be logged
dataLog = raw_input("log location: ")
#uses raw_input() for now, but can be removed later
print
#tag index
tagIndex = {}
def check(directory):
    global tagIndex
    contents = os.listdir(directory)
    #runs a for loop checking through list values
    for i in xrange(0,len(contents)):
        if os.path.isdir(directory + "/" + contents[i]):
            #if the file specified is a directory
            #recurse this function in a check on the directory found
            check(directory + "/" + contents[i])
            #if the length of the folder or file's name is greater than the length of the query
        else:
            #opens file to read
            file = open(directory + "/" + contents[i], 'r')
            #reads first line of file
            tagInfo = file.readline().lower()
            #checks if the file has the html comment
            if tagInfo[0:4] == "<!--":
                #removes html comment tags
                tagInfo = tagInfo.replace("<!--", "")
                tagInfo = tagInfo.replace("-->\n", "")
                #splits the file's tags into an array
                tagInfo = tagInfo.split(", ")
                #checks if the file's tags matches the tag query
                for j in xrange(0,len(tagInfo)):
                    if tagIndex.get(tagInfo[j]) == None:
                        tagIndex[tagInfo[j]] = [str(directory + "/" + contents[i])]
                    else:
                        # append the new number to tagInfo at this slot
                        tagIndex[tagInfo[j]].append(str(directory + "/" + contents[i]))

#start main
check(directoryPath)
#
#prints the dictionary
#tagIndex = sorted(tagIndex.items())
#tagIndex = [tagIndex.keys(),tagIndex.values()]
keys = []
values = []

for key in sorted(tagIndex.iterkeys()):
    keys.append(key)
    values.append(tagIndex[key])
tagIndex = [keys,values]
print tagIndex
#print tagIndex
with open(str(dataLog) + "/" + 'data.json', 'w') as fp:
    json.dump(tagIndex, fp)

exit()
