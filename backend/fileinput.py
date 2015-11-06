'''
This script reads and outputs a file.
'''

#file destination goes here
destination = raw_input("destination: ")
# file name goes here
filename = raw_input("filename: ")
#open file to read
file = open(str(destination) + "/" + filename, 'r')
#print the file listed
print
print file.read()
