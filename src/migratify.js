///
/// Migratify LLC ("COMPANY") CONFIDENTIAL
/// Copyright (c) 2020-2021 Migratify, All Rights Reserved.
///
/// NOTICE: All information contained herein is, and remains the property of Migratify. The intellectual and technical concepts contained
/// herein are proprietary to Migratify and may be covered by U.S. and Foreign Patents, patents in process, and are protected by trade secret or copyright law.
/// Dissemination of this information or reproduction of this material is strictly forbidden unless prior written permission is obtained
/// from Migratify. Access to the source code contained herein is hereby forbidden to anyone except current Migratify employees, managers or contractors who have executed 
/// Confidentiality and Non-disclosure agreements explicitly covering such access.
///
/// The copyright notice above does not evidence any actual or intended publication or disclosure of this source code, which includes 
/// information that is confidential and/or proprietary, and is a trade secret, of Migratify. ANY REPRODUCTION, MODIFICATION, DISTRIBUTION, PUBLIC PERFORMANCE, 
/// OR PUBLIC DISPLAY OF OR THROUGH USE OF THIS SOURCE CODE WITHOUT THE EXPRESS WRITTEN CONSENT OF Migratify IS STRICTLY PROHIBITED, AND IN VIOLATION OF APPLICABLE 
/// LAWS AND INTERNATIONAL TREATIES. THE RECEIPT OR POSSESSION OF THIS SOURCE CODE AND/OR RELATED INFORMATION DOES NOT CONVEY OR IMPLY ANY RIGHTS 
/// TO REPRODUCE, DISCLOSE OR DISTRIBUTE ITS CONTENTS, OR TO MANUFACTURE, USE, OR SELL ANYTHING THAT IT MAY DESCRIBE, IN WHOLE OR IN PART.
///

const fs = require('fs');

const isImage = require('is-image');
const isVideo = require('is-video');

const JSZip = require('jszip');

const ecommercePlatforms = require('./ecommerce-platforms');

/***
 * Converts any theme from a supported ecommerce platform into a Shopify theme.
 * @param {String} ecommercePlatform The ecommerce platform of the theme.
 * @param {String} filePath The file path of the theme.
 */
const convertEcommerceTheme = async (ecommercePlatform, filePath) => {
  // Check if an ecommerce platform has been parsed
  if (!ecommercePlatform) {
    throw 'Ecommerce platform must not be empty';
  }

  // Check if a file path has been parsed
  if (!filePath) {
    throw 'File Path must not be empty';
  }

  // Check if the ecommerce platform is supported
  if (!ecommercePlatforms.ECOMMERCE_PLATFORMS.includes(ecommercePlatform)) {
    throw 'Ecommerce platform is not supported';
  }
 
  try {
    // Read the theme as a zip file using the file path
    const themeFile = await fs.promises.readFile(filePath);
    const themeFileContent = await JSZip.loadAsync(themeFile);

    // Get the file name of the theme
    const fileName = filePath.split('/').pop().replace('.zip','')
  
    // Create a zip file for the new theme to be generated
    const newThemeFile = new JSZip();

    const newThemeFileSnippetsFolder = newThemeFile.folder('snippets');
    const newThemeFileAssetsFolder = newThemeFile.folder('assets');
    const newThemeFileLocalesFolder = newThemeFile.folder('locales');
    const newThemeFileSCSSFolder = newThemeFile.folder('scss');

    if (ecommercePlatform === 'BIGCOMMERCE') {
      // Get a list of all files within the theme 
      const themeFileFolders = [
        ...new Set(Object.keys(themeFileContent.files).filter(function(absolutePath) {
          // Convert the parsing absolute path to a relative path
          return absolutePath.startsWith(`${fileName}`) && !absolutePath.endsWith('/');
        })
      )];

      for (const [_, absolutePath] of themeFileFolders.entries()) {
          // Get a relative path of the parsing absolute path
          const relativePath = absolutePath.replace(`${fileName}/`, '');

          // Get the content of a file based on the parsing absolute path 
          const fileContent = await themeFileContent.files[absolutePath].async("string");

          // Check if the assets folder exists in the relative path
          if (relativePath.startsWith('assets')) {
            // Check if the relative path contains a dist folder
            if (relativePath.includes('dist/')) {
              continue;
            }

            // Check if the relative path is an image or video file
            if (isImage(relativePath) || isVideo(relativePath)) {
              continue;
            }
                        
            // Get the content of a file based on the parsing absolute path 
            const fileContent = await themeFileContent.files[absolutePath].async("string");

            // Check if the relative path contains a icons folder
            if (relativePath.includes('icons/')) {
              // Create a file for the new theme's assets folder using the relative path and file content
              newThemeFileAssetsFolder.file(relativePath.replace('assets/icons/',''),  fileContent);

              continue;
            }

            // Check if the relative path is a SASS or SCSS file
            if (relativePath.endsWith('.sass') || relativePath.endsWith('.scss')) { 
              // Create a file for the new theme's SCSS folder using the relative path and file content
              newThemeFileSCSSFolder.file(relativePath.replace('assets/scss/',''),  fileContent);

              continue;
            }

            // Create a file for the new theme's assets folder using the relative path and file content
            newThemeFileAssetsFolder.file(relativePath.replace('assets/',''),  fileContent);
          }

          // Check if the lang folder exists in the relative path
          if (relativePath.startsWith('lang')) {
            // Create a file for the new theme's locales folder using the relative path and file content
            newThemeFileLocalesFolder.file(relativePath.replace('lang/',''),  fileContent);
          } 

          // Check if the components folder exists in the relative path
          if (relativePath.startsWith('components')) {
            // TODO Implement functionality
            throw 'Not Implemented';
          }

          // Check if the layout folder exists in the relative path
          if (relativePath.startsWith('layout')) {
            // TODO Implement functionality
            throw 'Not Implemented';
          }

          // Check if the pages folder exists in the relative path
          if (relativePath.startsWith('pages')) {
            // TODO Implement functionality
            throw 'Not Implemented';
          }
      }
    } else if (ecommercePlatform === 'MAGENTO') {
      // TODO Implement functionality
      throw 'Not Implemented';
    }
  } catch (error) {
    // TODO Error handling
    throw error;
  }

  return 'OK'
};

/***
 * Determines if the theme derives from a supported ecommerce platform.
 * @param {String} filePath The file path of the theme.
 */
const determineEcommercePlatform = async (filePath) => {
  // Check if a file path has been parsed
  if (!filePath) {
    throw 'File Path must not be empty';
  }

  // Read the theme using the file path
  const themeFile = await fs.promises.readFile(filePath);
  const themeFileContent = await JSZip.loadAsync(themeFile);

  // Get a list of all folders in the top-level directory of the theme file
  const topLevelDirectoryFolders = [
    ...new Set(Object.keys(themeFileContent.files).map(function(absolutePath) {
      // Check if the parsing absolute path contains a folder
      return !absolutePath.includes('.') && absolutePath.includes('/') ? absolutePath.split('/')[1] : '';
    })
  )];

  // Check if the top level directory folders matches BigCommerce's theme file structure
  const bigCommerceThemeFileStructure = ['assets','lang','meta','templates'];

  const isBigCommerceTheme = topLevelDirectoryFolders.filter(function(absolutePath) {
    return bigCommerceThemeFileStructure.includes(absolutePath) ? absolutePath : '';
  }).length === bigCommerceThemeFileStructure.length;

  if (isBigCommerceTheme) {
    return 'BIGCOMMERCE';
  }

  // Check if the top level directory folders matches Magento's theme file structure
  const magentoThemeFileStructure = ['i18n', 'media', 'web'];

  const isMagentoTheme = topLevelDirectoryFolders.filter(function(absolutePath) {
    return magentoThemeFileStructure.includes(absolutePath) ? absolutePath : '';
  }).length === magentoThemeFileStructure.length;

  if (isMagentoTheme) {
    return 'MAGENTO';
  }
}

exports.convertEcommerceTheme = convertEcommerceTheme;
exports.determineEcommercePlatform = determineEcommercePlatform;