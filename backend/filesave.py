'''
This script writes to a file.
'''
tags = raw_input("tags: ")
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
#writes text to file
file.write("<!--" + tags + "-->\n")
file.write(text)
exit()
