import json

#this is where the directory is
#this will read from conf file later
directory = raw_input("directory: ")
#where the dicionary data should be logged
dataLog = raw_input("log folder: ")
#uses raw_input() for now, but can be removed later

#loads data from data.json file
with open(str(dataLog + "/" + 'data.json'), 'r') as fp:
    tagIndex = json.load(fp)

fullTag = []
keyPosition = []

while True:
    #one character at a time
    tag = raw_input("tag character: ")[0].lower()
    fullTag.append(tag)
    print
    #tagIndex[0] is the keys of the dictionary
    #tagIndex[1] has the values of the dictionary

    #loop
    if len(fullTag) == 1:
        checkBool = False
        print "".join(fullTag) + "\n"
        for i in xrange(0,len(tagIndex[0])):
            if fullTag[0] == tagIndex[0][i][0]:
                keyPosition.append(i)
                print tagIndex[0][i]
                print tagIndex[1][i]
                print
                checkBool = True

            if checkBool == True and fullTag[0] != tagIndex[0][i][0]:
                break

    else:
        print "".join(fullTag) + "\n"
        for i in keyPosition:
            #[0, 4, 5, 8]
            if fullTag[len(fullTag)-1] == tagIndex[0][i][len(fullTag)-1]:
                print tagIndex[0][i]
                print tagIndex[1][i]
                print
    print
