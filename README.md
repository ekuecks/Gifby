# Gifby
Gifby is a scripting language and extension designed to automate web activity. Currently, you can record yourself doing an action and then play it back (no saving scripts for later). When you do an action that affects the webpage (i.e. click or fill in a form) the extension will create a Gifby command for you to do that action. Things are a little rough so when you fill in a form, the text will not update until you click something (clicking the form you are filling out works).

# Usage
Clone this repo then open up your chrome extension preferences. Click 'load unpacked extension' and choose the directory where you cloned the repo. Then you have to start chrome with some security options disabled using this: 
```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --allow-file-access-from-files  --disable-web-security --user-data-dir
```
If you want to erase the Gifby console, reload the extension and refresh the page.
