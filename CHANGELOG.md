#0.26 (2016.1.8)
####CHANGESS####
-- **removed alloyeditor because of its problems**
--**added "easyeditor"**
-- **editing AND saving work**
-- **tagIndex has issues when you change tags when saving**
-- **someone please fix easyeditor.css so that the toolbar doesnt have huge margin to left.**
-- **try to make the placeholder text for the editor gray (se bottom of style.css)**

#0.26 (2016.1.8)
####javascript migration####
-- **no more python!!! (bittersweet for me)**
-- **still able to edit, but save button doesnt work**
-- **someone try to fix that pls**
-- **files concerned are editor.html, editcontent.js, and editor.js**

#0.25 (2016.1.7)
####cleaning####
-- **got rid of some junk**

#0.24 (2016.1.7)
####editing####
-- **now can open files from app.html but cant save yet**

#0.23 (2016.1.4)
####filemanager####
-- **don't see any tag issues for me**
-- **html page now refreshes every time you visit, to update content**

#0.22 (2016.1.3)
#### filemanager-ish
-- **semi-finished js file manager**
-- **now refreshes**

#0.21 (2016.1.3)
#### filemanager-ish
-- **semi-finished js file manager**
-- **problem: doesnt refresh when you edit another thing**

#0.20 (2016.1.2)
-- **saves when built! :)**
-- **(at least for linux)**

#0.19 (2015.12.30)
-- **tried to fix directory problem with "__dirname", but it's not working. not sure why, but pls fix**


#0.18 (2015.12.30)
<<<<<<< HEAD
#### bugfix
- **now fixed the freezing bug (i was sending messages synchronously, needed async.)**
-- **not sure how to set PATH, given that the directory structure of the built version and unbuilt version is different.**
-- **May just ignore problem until we set up settings page.**
-- **saving Does work if you give it the right directory structure**
=======
#### FIXED SAVING!!!!
- **no longer freezes on save, moved from saveSync to just save; see [this](https://github.com/atom/electron/blob/master/docs/api/ipc-renderer.md)**
- **muy exite!**
>>>>>>> 55decc7650950713cf1e0f6d41e3b67ceb57f32c

#0.17 (2015.12.29)
#### ADDED SAVING!!!!
- **now saves to a file in /app/backend/testfolder :)**
- **bug: freezes immediatly (sry bad spelling) after saving**
- **muy exite!**

#0.16 (2015.12.28)
#### semi-saving
- **when you click the "save" button at the bottom of the Flow page, it will output 3 window alerts**
- **first, the title text**
- **second, the tag text**
- third, the html code for the content you edit

#0.15 (2015.12.28)
#### AlloyEditor
- **added alloy editor. click on Flow to see**

# 0.1.4 (2015.12.23)

#### More Improvements
- **tried to work on webpack.config.js to build bundle.js, epic fail**
- **helperino por favor**

# 0.1.3 (2015.12.23)

#### More Improvements
- **got rid of old stuff**
- **less clunk. old stuff is in /oldstuff**

# 0.1.2 (2015.12.23)

#### More Improvements
- **fixed el jqueryerino! :(**
- **doesnt look like Windows 95**

# 0.1.1 (2015.12.23)

#### More Improvements
- **fixed problems with non-functional css**
- **have issues loading jquery. pls help me adam :(**
- **pl0x adderino to changlogerino at the toperino**


# 0.1.0 (2015.12.23)

#### Improvements

- **moved into electron**
- **using electron-react-boilerplate**
- **broke lots of Issac's stuff**
- **oops!**
