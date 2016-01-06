'''
This script writes to a file.
'''
tags = raw_input("tags: ").split(" ")
# text goes here
text = raw_input("text: ")
#file destination goes here
destination = raw_input("destination: ")
# file name goes here
filename = raw_input("filename: ")
#open file to write
file = open(str(destination) + "/" + filename, 'w')
#deletes previous contents of file
file.truncate()
#this line initializes the string that will be entered into the file
strTag = tag[0]
#then we iterate through all the tags to add them to the list
#we skip the first one for formatting reasons
for tag in tags:
    #if the tag is the first tag, then it passes
    if tag == tags[0]:
        pass
    #else it will add the tag after a space
    else:
        strTag = strTag + " " + tag
#writes text to file
file.write("<!--" + strTag + "-->\n")
file.write(text)
exit()
