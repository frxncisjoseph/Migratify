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

const migratify = require('./src/migratify.js');

(async() => {
    // Determine the ecommerce platform of the theme to be converted
    const ecommercePlatform = await migratify.determineEcommercePlatform('resources/braitime-master.zip');
    // Convert the ecommerce theme to a Shopify theme
    const shopifyTheme = await migratify.convertEcommerceTheme(ecommercePlatform, 'resources/braitime-master.zip');

    console.log(shopifyTheme); // debug
})();