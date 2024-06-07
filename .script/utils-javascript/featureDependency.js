//node .scripts/javascript/script.js
 
// Include fs module
const fs = require('fs');
const { execSync } = require('child_process');

const NEWBRANCH = executeGitCommand('git switch -c TestBranch');


// Calling the readFileSync() method
const data = fs.readFileSync('sfdx-project.json',
   { encoding: 'utf8', flag: 'r' });
 
//parse into object
const obj = JSON.parse(data);

//load top level versions into a map
const map1 = new Map();
for(const item of obj.packageDirectories){
   map1.set(item.package, item.versionNumber);
}
 
//for each package
for(const item of obj.packageDirectories){
   //check if there's a package (ignore if no package name)
   if(item.package){
       //check if there are dependencies
       if(item.dependencies){
           //for each dependency
           for(const dependency of item.dependencies){
               //get the latest version from the map
               //remove the LATEST or NEXT
               const latestVersion = removeLatestNext(map1.get(dependency.package));
               //console.log('latestVersion ',latestVersion);
               const dependencyVersion = removeLatestNext(dependency.versionNumber);
               //console.log('dependencyVersion ',dependencyVersion);
               
               //compare them (alphabetically)
               const compare = latestVersion.localeCompare(dependencyVersion);
               //console.log('compare ',compare);
               
               //start output string
               var outputString = 'For package '+item.package+', the dependency on '+dependency.package+': ';
               //console.log('outputString ',outputString)
 
               if(compare == 1){
                   //1 if string1 is greater (higher in the alphabetical order) than string2
                   outputString = outputString+'latestVersion is higher in alphabetical order than dependencyVersion';
				   
               } else if(compare == 0){
                   //0 if string1 and string2 are equal in the alphabetical order
                   outputString = outputString+'latestVersion is equal in alphabetical order to dependencyVersion';
               } else if (compare == -1){
                   //-1 if string1 is smaller (lower in the alphabetical order) than string2
                   outputString = outputString+'latestVersion is lower in alphabetical order than dependencyVersion';
               } else {
                   //error
               }
               console.log(outputString);
           }
       }else{
           console.log('For package',item.package,'there are no dependencies to check');
       }
   }
   
   
}
 
function removeLatestNext(myString) {
   const result = myString.substring(0,myString.lastIndexOf('.'));
   return result;
}

function executeGitCommand(command) {
  return execSync(command)
    .toString('utf8')
    .replace(/[\n\r\s]+$/, '');
}