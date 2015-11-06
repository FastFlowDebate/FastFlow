import os
'''
compiles tags into a list to be used for easier searching
compiles at runtime
'''

#this is where the directory is
#this will read from conf file later
directoryPath = raw_input("directory: ")
#input goes here, called "query"
#uses raw_input() for now, but can be removed later
tag = raw_input("tag: ")
#length of tag
tagLen = len(tag)
print
def check(directory):
    contents = os.listdir(directory)
    global tag
    global tagLen
    #runs a for loop checking through list values
    for i in xrange(0,len(contents)):
        if os.path.isdir(directory + "/" + contents[i]):
            #if the file specified is a directory
            #recurse this function in a check on the directory found
            check(directory + "/" + contents[i])
        else:
            #opens file to read
            file = open(directory + "/" + contents[i], 'r')
            #reads first line of file
            tagInfo = file.readline()
            #removes html comment tags
            tagInfo = tagInfo.replace("<!--", "")
            tagInfo = tagInfo.replace("-->\n", "")
            #splits the file's tags into an array
            tagInfo = tagInfo.split(", ")
            #checks if the file's tags matches the tag query
            for j in xrange(0,len(tagInfo)):
                if tag == tagInfo[j][0 : tagLen]:
                    #print the name of that file
                    print directory + "/" + contents[i]

#start main
check(directoryPath)
