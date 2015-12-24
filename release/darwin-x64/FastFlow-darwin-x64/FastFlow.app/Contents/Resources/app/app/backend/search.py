'''
This script searches through a folder for files starting with the query given.
'''

import os
#this is where the directory is
#this will read from conf file later
directoryPath = raw_input("directory: ")

#input goes here, called "query"
#uses raw_input() for now, but can be removed later
query = raw_input("query: ").lower()
print
queryLen = len(query)
#searches and returns contents of folder
def check(directory):
    contents = os.listdir(directory)
    global query
    global queryLen
    #runs a for loop checking through list values
    for i in xrange(0,len(contents)):
        if os.path.isdir(directory + "/" + contents[i]):
            #if the file specified is a directory
            #recurse this function in a check on the directory found
            check(directory + "/" + contents[i])
            #if the length of the folder or file's name is greater than the length of the query
        else:
            if len(contents[i]) >= queryLen:
                #and if part of the file or folder's name matches up to the query
                if query == contents[i][0 : queryLen]:
                    #print the name of that folder or file
                    print directory + "/" + contents[i]
#start main
check(directoryPath)
