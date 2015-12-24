import json
'''
tag daemon
1st input: index data.json folder location (don't append in the data.json filename)
2nd to infinty input: single characters directly taken from the typing.
    (enter "quit" to exit)
    (if you enter a space, it clears the previous characters)
    output:(TBD)

'''


#where the dicionary data should be logged
dataLog = raw_input("log folder: ")
#uses raw_input() for now, but can be removed later

#loads data from data.json file
with open(str(dataLog + "/" + 'data.json'), 'r') as fp:
    tagIndex = json.load(fp)

fullTag = []
keyPosition = range(0,len(tagIndex[0]))
newkeyPosition = []

while True:
    #one character at a time
    tag = raw_input("tag character: ").lower()
    fullTag.append(tag)
    print
    #tagIndex[0] is the keys of the dictionary
    #tagIndex[1] has the values of the dictionary
    if tag == "quit":
        exit()
    elif tag == " ":
        fullTag = []
        keyPosition = range(0,len(tagIndex[0]))
        newkeyPosition = []
    else:
        checkBool = False
        print "".join(fullTag) + "\n"
        for i in keyPosition:
            #[0, 4, 5, 8] style
            if checkBool == True and fullTag[0] != tagIndex[0][i][0]:
                break
            if len(tagIndex[0][i]) >= len(fullTag):
                if fullTag[len(fullTag)-1] == tagIndex[0][i][len(fullTag)-1]:
                    newkeyPosition.append(i)
                    print tagIndex[0][i]
                    print tagIndex[1][i]
                    print
                    checkBool = True
        keyPosition = newkeyPosition
        newkeyPosition = []

        print
