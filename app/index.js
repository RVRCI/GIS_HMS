var configdata = configdataroot;
var MainCSV;
var MeadianLHSCSV = [];
var MeadianRHSCSV =[];
var map;
var MainCSVArr = [];
var MeadianRHSArr = [];
var MeadianLHSArr = [];
//var medianLHSCSV = [];
var MeadianAssetsArr = [];
var LHSAssetsArr = [];
var RHSAssetsArr = [];
var BHSAssetsArr = [];
var currentZoomLevel;
var DashedLineRemove = [];
var RemoveAssetMarker = [];
var RemoveHighMast =[];
var RemoveSolarBlinker = [];
var RemoveKmStone = [];
var RemoveSignBoard = [];
//******************* LHS - OffsetLine 1 **********************/
var OffsetLHSLine1CSV = [];
var OffsetLHSLine1Arr = [];
//********************LHS - OffsetLine 2************************ */
var OffsetLHSLine2CSV;
var OffsetLHSLine2Arr = [];
//********************LHS - OffsetLine 11************************ */
var OffsetLHSLine11CSV;
var OffsetLHSLine11Arr = [];
//********************LHS - OffsetLine 12************************ */
var OffsetLHSLine12CSV;
var OffsetLHSLine12Arr = [];
//******************* RHS - OffsetLine 1 **********************/
var OffsetRHSLine1CSV;
var OffsetRHSLine1Arr = [];
//********************RHS - OffsetLine 2************************ */
var OffsetRHSLine2CSV;
var OffsetRHSLine2Arr = [];
//********************RHS - OffsetLine 11************************ */
var OffsetRHSLine11CSV;
var OffsetRHSLine11Arr = [];
//********************RHS - OffsetLine 12************************ */
var OffsetRHSLine12CSV;
var OffsetRHSLine12Arr = [];
//********************RHS - OffsetLine 3************************ */
var OffsetRHSLine3CSV;
var OffsetRHSLine3Arr = [];
//********************LHS - OffsetLine 2************************ */
var OffsetLHSLine3CSV;
var OffsetLHSLine3Arr = [];

//********************Bridge Masters ************************ */
var recordArrBridgeMaster;

//********************Service Masters ************************ */
var recordArrServiceRoadMaster;

//********************Bridge Masters ************************ */
var BridgeFileCSV;
var BridgeFileArr = [];

//********************Project Assets ************************ */
var recordArrProjectAssets = [];

//********************Service Road ************************ */
var ServiceRoadFileCSV;
var ServiceRoadFileArr = [];
//********************  Fetching Defetc  ************************ */
var recordArrDefects = [];
var TotalDefectsCount;

var FinalDefect = [];
var Defectmarker = [];

//Assets image
var recordArrAssetsImage;

//********************** Work zone ************************* */
var recordArrWorkzoneCSV;
var WorkzoneArr = [];
var WorkzoneMarker = [];

//OnclickChainage
var currentOverlay = null;
var nearestPoint;
 initializeMap();



 function showLoadingSpinner() {
  document.getElementById('loadingSpinner').style.display = 'block';
}

// Hide loading spinner
function hideLoadingSpinner() {
  document.getElementById('loadingSpinner').style.display = 'none';
}
showLoadingSpinner();
// Simulate loading data (e.g., with setTimeout)
setTimeout(function() {
  hideLoadingSpinner();
}, 9000);
 fetchDataAndProcess();

//******* Map Initilize  **************/

 function initializeMap()
  {
    const myLatLng = { lat: 20.71135, lng: 86.13553 };
     map = new google.maps.Map(document.getElementById("map"), {
      zoom: 10,
      maxZoom: 18,
      minZoom: 11,
      center: myLatLng,
      scrollwheel: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
      },
      {
          featureType: 'administrative',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }],
      },
      {
          featureType: 'road',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
      },
      {
          featureType: 'administrative.country',
          elementType: 'labels.text',
          stylers: [{ visibility: 'on' }],
      },
      {
          featureType: 'administrative.locality',
          elementType: 'labels.text',
          stylers: [{ visibility: 'on' }],
      },
      {
          featureType: 'administrative.neighborhood',
          elementType: 'labels.text',
          stylers: [{ visibility: 'off' }],
      },
    ],
    });
    // new google.maps.Marker({
    //     position: 
    //     {lat: 20.53782804, lng: 85.96088145},
    //     map,
    //     title: "GIS",
    //   });
      
  }


  async function fetchDataAndProcess() {
    await ZOHO.CREATOR.init();
  
    // Get Latest Record ID
    const configLatestRecord = {
      reportName: "All_Gis_chainage_Files",
      page: 1,
      pageSize: 1
    };
    
    const latestRecordPromise = ZOHO.CREATOR.API.getAllRecords(configLatestRecord).then(response => {
      return response.data[0]['ID'];
    });
  
    // Get Latest Record ID for workzone
    const configLatestRecordWorkzone = {
      reportName: "All_Workzone_Masters",
      page: 1,
      pageSize: 1
    };
  
    const latestRecordWorkzonePromise = ZOHO.CREATOR.API.getAllRecords(configLatestRecordWorkzone).then(response => {
      return response.data[0]['ID'];
    });
  
    const [latestRecordIDResult, latestRecordIDWorkzoneResult] = await Promise.allSettled([latestRecordPromise, latestRecordWorkzonePromise]);
  
    const LatestRecordID = latestRecordIDResult.status === 'fulfilled' ? latestRecordIDResult.value : null;
    const LatestRecordIDWorkzone = latestRecordIDWorkzoneResult.status === 'fulfilled' ? latestRecordIDWorkzoneResult.value : null;
  
    if (!LatestRecordID || !LatestRecordIDWorkzone) {
      console.error("Failed to fetch latest record IDs");
      return;
    }
  
    // Fetch MainFile and other files
    const MainFile = {
      appName: "highway-maintenance-system",
      reportName: "All_Gis_chainage_Files",
      id: LatestRecordID,
      fieldName: "Main_Median_CSV"
    };
    
    const mainFilePromise = ZOHO.CREATOR.API.readFile(MainFile);
  
    const BridgeFile = {
      appName: "highway-maintenance-system",
      reportName: "All_Gis_chainage_Files",
      id: LatestRecordID,
      fieldName: "BridgeFile"
    };
  
    const bridgeFilePromise = ZOHO.CREATOR.API.readFile(BridgeFile);
  
    const Workzone = {
      appName: "highway-maintenance-system",
      reportName: "All_Workzone_Masters",
      id: LatestRecordIDWorkzone,
      fieldName: "work_zone_file"
    };
  
    const workzoneFilePromise = ZOHO.CREATOR.API.readFile(Workzone);
  
    const ServiceRoadFile = {
      appName: "highway-maintenance-system",
      reportName: "All_Gis_chainage_Files",
      id: LatestRecordID,
      fieldName: "ServiceRoadFiles"
    };
  
    const serviceRoadFilePromise = ZOHO.CREATOR.API.readFile(ServiceRoadFile);
  
    const assetsImagePromise = ZOHO.CREATOR.API.getAllRecords({
      reportName: "Assets_category_and_sub_category_master_Report",
      page: 1,
      pageSize: 200
    });
  
    const assetsCountPromise = ZOHO.CREATOR.API.getRecordCount({
      reportName: "All_Gis_Project_Facility_Masters",
      criteria: "(SPV.Display_Name == \"SJEPL\")"
    });
  
    const defectsCountPromise = ZOHO.CREATOR.API.getRecordCount({
      criteria: "(SPV_Name.Display_Name == \"SJEPL\")",
      reportName: "All_Defect_Creations"
    });
  
    const results = await Promise.allSettled([
      mainFilePromise,
      bridgeFilePromise,
      workzoneFilePromise,
      serviceRoadFilePromise,
      assetsImagePromise,
      assetsCountPromise,
      defectsCountPromise
    ]);
  
    const [mainFileResult, bridgeFileResult, workzoneFileResult, serviceRoadFileResult, assetsImageResult, assetsCountResult, defectsCountResult] = results;
  
     MainCSV = mainFileResult.status === 'fulfilled' ? mainFileResult.value : null;
     BridgeFileCSV = bridgeFileResult.status === 'fulfilled' ? bridgeFileResult.value : null;
     recordArrWorkzoneCSV = workzoneFileResult.status === 'fulfilled' ? workzoneFileResult.value : null;
     ServiceRoadFileCSV = serviceRoadFileResult.status === 'fulfilled' ? serviceRoadFileResult.value : null;
     recordArrAssetsImage = assetsImageResult.status === 'fulfilled' ? assetsImageResult.value.data : null;
    var TotalAssetsCount = assetsCountResult.status === 'fulfilled' ? parseInt(assetsCountResult.value.result['records_count']) : 0;
     TotalDefectsCount = defectsCountResult.status === 'fulfilled' ? parseInt(defectsCountResult.value.result['records_count']) : 0;
  
    if (!MainCSV || !BridgeFileCSV || !recordArrWorkzoneCSV || !ServiceRoadFileCSV || !recordArrAssetsImage) {
      console.error("Failed to fetch some required data");
      return;
    }
  
    // Fetch Project Assets data
    //const recordArrProjectAssets = [];
    if (TotalAssetsCount > 200) {
      const assetPromises = [];
      const count = Math.ceil(TotalAssetsCount / 200);
      for (let i = 1; i <= count; i++) {
        const configAssets = {
          reportName: "All_Gis_Project_Facility_Masters",
          criteria: "(SPV.Display_Name == \"SJEPL\")",
          page: i,
          pageSize: 200
        };
        assetPromises.push(ZOHO.CREATOR.API.getAllRecords(configAssets));
      }
      const assetResults = await Promise.allSettled(assetPromises);
      assetResults.forEach(result => {
        if (result.status === 'fulfilled') {
          recordArrProjectAssets.push(...result.value.data);
         
        }
      });
    } else {
      const configProjectAssets = {
        reportName: "All_Gis_Project_Facility_Masters",
        criteria: "(SPV.Display_Name == \"SJEPL\")",
        page: 1,
        pageSize: 200
      };
      const projectAssetsResult = await ZOHO.CREATOR.API.getAllRecords(configProjectAssets);
      recordArrProjectAssets.push(...projectAssetsResult.data);
    }
  
    // Fetch Defects data
     recordArrDefects = [];
    if (TotalDefectsCount > 200) {
      const defectPromises = [];
      const count = Math.ceil(TotalDefectsCount / 200);
      for (let i = 1; i <= count; i++) {
        const configDefect = {
          reportName: "All_Defect_Creations",
          criteria: "(SPV_Name.Display_Name == \"SJEPL\")",
          page: i,
          pageSize: 200
        };
        defectPromises.push(ZOHO.CREATOR.API.getAllRecords(configDefect));
      }
      const defectResults = await Promise.allSettled(defectPromises);
      defectResults.forEach(result => {
        if (result.status === 'fulfilled') {
          recordArrDefects.push(...result.value.data);
        }
      });
    } else {
      const configDefect = {
        reportName: "All_Defect_Creations",
        criteria: "(SPV_Name.Display_Name == \"SJEPL\")",
        page: 1,
        pageSize: 200
      };
      const defectResult = await ZOHO.CREATOR.API.getAllRecords(configDefect);
      recordArrDefects.push(...defectResult.data);

    }
  
    // Process data
    CSVtoGeoJson();
  }
  
  function CSVtoGeoJson()
  { 
    // Split the data by lines
    var lines = MainCSV.split('\n');

    // Initialize empty arrays for each section
    var medianCoordinateData = [];
    var medianLHSData = [];
    var medianRHSData = [];
    var offsetLHSLine1 = [];
    var offsetLHSLine2 = [];
    var offsetLHSLine11 = [];
    var offsetLHSLine12 = [];
    var offsetRHSLine1 = [];
    var offsetRHSLine2 = [];
    var offsetRHSLine11 = [];
    var offsetRHSLine12 = [];
    var offsetLHSLine3 = [];
    var offsetRHSLine3 = [];

    // Initialize a variable to track the current section
    var currentSection = '';

    // Process each line
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();

        // Check for section headers
        if (line === 'Median Coordinate') {
            currentSection = 'Median Coordinate';
        } else if (line === 'Median LHS') {
            currentSection = 'Median LHS';
        } else if (line === 'Median RHS') {
         currentSection = 'Median RHS';
     } else if (line === 'OffsetLHSLine1') {
       currentSection = 'OffsetLHSLine1';
   }else if (line === 'OffsetLHSLine2') {
     currentSection = 'OffsetLHSLine2';
 }else if (line === 'OffsetLHSLine11') {
   currentSection = 'OffsetLHSLine11';
}else if (line === 'OffsetLHSLine12') {
 currentSection = 'OffsetLHSLine12';
}else if (line === 'OffsetRHSLine1') {
currentSection = 'OffsetRHSLine1';
}else if (line === 'OffsetRHSLine2') {
currentSection = 'OffsetRHSLine2';
}else if (line === 'OffsetRHSLine11') {
currentSection = 'OffsetRHSLine11';
}else if (line === 'OffsetRHSLine12') {
currentSection = 'OffsetRHSLine12';
}else if (line === 'OffsetLHSLine3') {
currentSection = 'OffsetLHSLine3';
}else if (line === 'OffsetRHSLine3') {
currentSection = 'OffsetRHSLine3';
}else if (line.length > 0) {
            // Add data to the appropriate section array
            if (currentSection === 'Median Coordinate') {
                medianCoordinateData.push(line.replace(/\s+/g, ','));
            } else if (currentSection === 'Median LHS') {
                medianLHSData.push(line.replace(/\s+/g, ','));
            }else if (currentSection === 'Median RHS') {
             medianRHSData.push(line.replace(/\s+/g, ','));
         }else if (currentSection === 'OffsetLHSLine1') {
           offsetLHSLine1.push(line.replace(/\s+/g, ','));
       }else if (currentSection === 'OffsetLHSLine2') {
         offsetLHSLine2.push(line.replace(/\s+/g, ','));
     }else if (currentSection === 'OffsetLHSLine11') {
       offsetLHSLine11.push(line.replace(/\s+/g, ','));
   }else if (currentSection === 'OffsetLHSLine12') {
     offsetLHSLine12.push(line.replace(/\s+/g, ','));
 }else if (currentSection === 'OffsetRHSLine1') {
   offsetRHSLine1.push(line.replace(/\s+/g, ','));
}else if (currentSection === 'OffsetRHSLine2') {
 offsetRHSLine2.push(line.replace(/\s+/g, ','));
}else if (currentSection === 'OffsetRHSLine11') {
offsetRHSLine11.push(line.replace(/\s+/g, ','));
}else if (currentSection === 'OffsetRHSLine12') {
offsetRHSLine12.push(line.replace(/\s+/g, ','));
}else if (currentSection === 'OffsetLHSLine3') {
offsetLHSLine3.push(line.replace(/\s+/g, ','));
}else if (currentSection === 'OffsetRHSLine3') {
offsetRHSLine3.push(line.replace(/\s+/g, ','));
}
        }
    }

    // Function to format CSV data
    function formatCSV(data) {
        return 'lat,long,chainage\n' + data.join('\n');
    }

    // Format the CSV data
     MainCSV = formatCSV(medianCoordinateData);
     MeadianLHSCSV = formatCSV(medianLHSData);
     MeadianRHSCSV = formatCSV(medianRHSData);
     OffsetLHSLine1CSV = formatCSV(offsetLHSLine1);
     OffsetLHSLine2CSV = formatCSV(offsetLHSLine2);
     OffsetLHSLine11CSV = formatCSV(offsetLHSLine11);
     OffsetLHSLine12CSV = formatCSV(offsetLHSLine12);
     OffsetRHSLine1CSV = formatCSV(offsetRHSLine1);
     OffsetRHSLine2CSV = formatCSV(offsetRHSLine2);
     OffsetRHSLine11CSV = formatCSV(offsetRHSLine11);
     OffsetRHSLine12CSV = formatCSV(offsetRHSLine12);
     OffsetRHSLine3CSV = formatCSV(offsetRHSLine3);
     OffsetLHSLine3CSV = formatCSV(offsetLHSLine3);
     
  var CSVSplitMeadianRHS = MeadianRHSCSV.split('\n');
  for (var i = 0; i < CSVSplitMeadianRHS.length; i++) {
  const columns = CSVSplitMeadianRHS[i].split(',');
  const lat = parseFloat(columns[0]);
  const lng = parseFloat(columns[1]);
  const Chainage = parseFloat(columns[2]);
  if(!isNaN(lat) && !isNaN(lng))
  {
    var temp = {
      lat : lat,
      lng : lng,
      chainage : Chainage 
    }
    MeadianRHSArr.push(temp);
  } 
 }
 

  //*********************Converting LHS Meadian *********************/

 var CSVSplitMeadianLHS = MeadianLHSCSV.split('\n');
 for (var i = 0; i < CSVSplitMeadianLHS.length; i++) {
 const columns = CSVSplitMeadianLHS[i].split(',');

 const lat = parseFloat(columns[0]);
 const lng = parseFloat(columns[1]);
 const Chainage = parseFloat(columns[2]);

 if(!isNaN(lat) && !isNaN(lng))
 {
  
   var temp = {
     lat : lat,
     lng : lng,
     chainage : Chainage 
   }
   //console.log('medianLHSCSV = \n' + temp);
   MeadianLHSArr.push(temp);
   
 } 
}

  //*********************Converting Offset LHSLine1 *********************/
  var CSVSplitOffsetLHS1 = OffsetLHSLine1CSV.split('\n');
  for (var i = 0; i < CSVSplitOffsetLHS1.length; i++) {
  const columns = CSVSplitOffsetLHS1[i].split(',');
  const lat = parseFloat(columns[0]);
  const lng = parseFloat(columns[1]);
  const Chainage = parseFloat(columns[2]);
  if(!isNaN(lat) && !isNaN(lng))
  {
    var temp = {
      lat : lat,
      lng : lng,
      chainage : Chainage 
    }
    OffsetLHSLine1Arr.push(temp);
  } 
 }

   //*********************Converting Offset LHSLine2 *********************/
   var CSVSplitOffsetLHS2 = OffsetLHSLine2CSV.split('\n');
   for (var i = 0; i < CSVSplitOffsetLHS2.length; i++) {
   const columns = CSVSplitOffsetLHS2[i].split(',');
   const lat = parseFloat(columns[0]);
   const lng = parseFloat(columns[1]);
   const Chainage = parseFloat(columns[2]);
   if(!isNaN(lat) && !isNaN(lng))
   {
     var temp = {
       lat : lat,
       lng : lng,
       chainage : Chainage 
     }
     OffsetLHSLine2Arr.push(temp);
   } 
  }
    //*********************Converting Offset LHSLine11 *********************/
    var CSVSplitOffsetLHS11 = OffsetLHSLine11CSV.split('\n');
    for (var i = 0; i < CSVSplitOffsetLHS11.length; i++) {
    const columns = CSVSplitOffsetLHS11[i].split(',');
    const lat = parseFloat(columns[0]);
    const lng = parseFloat(columns[1]);
    const Chainage = parseFloat(columns[2]);
    if(!isNaN(lat) && !isNaN(lng))
    {
      var temp = {
        lat : lat,
        lng : lng,
        chainage : Chainage 
      }
      OffsetLHSLine11Arr.push(temp);
    } 
   }
    //*********************Converting Offset LHSLine12 *********************/
    var CSVSplitOffsetLHS12 = OffsetLHSLine12CSV.split('\n');
    for (var i = 0; i < CSVSplitOffsetLHS12.length; i++) {
    const columns = CSVSplitOffsetLHS12[i].split(',');
    const lat = parseFloat(columns[0]);
    const lng = parseFloat(columns[1]);
    const Chainage = parseFloat(columns[2]);
    if(!isNaN(lat) && !isNaN(lng))
    {
      var temp = {
        lat : lat,
        lng : lng,
        chainage : Chainage 
      }
      OffsetLHSLine12Arr.push(temp);
    } 
   }
      //*********************Converting Offset RHSLine1 *********************/
      var CSVSplitOffsetRHS1 = OffsetRHSLine1CSV.split('\n');
      for (var i = 0; i < CSVSplitOffsetRHS1.length; i++) {
      const columns = CSVSplitOffsetRHS1[i].split(',');
      const lat = parseFloat(columns[0]);
      const lng = parseFloat(columns[1]);
      const Chainage = parseFloat(columns[2]);
      if(!isNaN(lat) && !isNaN(lng))
      {
        var temp = {
          lat : lat,
          lng : lng,
          chainage : Chainage 
        }
        OffsetRHSLine1Arr.push(temp);
      } 
     }
           //*********************Converting Offset RHSLine2 *********************/
           var CSVSplitOffsetRHS2 = OffsetRHSLine2CSV.split('\n');
           for (var i = 0; i < CSVSplitOffsetRHS2.length; i++) {
           const columns = CSVSplitOffsetRHS2[i].split(',');
           const lat = parseFloat(columns[0]);
           const lng = parseFloat(columns[1]);
           const Chainage = parseFloat(columns[2]);
           if(!isNaN(lat) && !isNaN(lng))
           {
             var temp = {
               lat : lat,
               lng : lng,
               chainage : Chainage 
             }
             OffsetRHSLine2Arr.push(temp);
           } 
          }
              //*********************Converting Offset RHSLine11 *********************/
    var CSVSplitOffsetRHS11 = OffsetRHSLine11CSV.split('\n');
    for (var i = 0; i < CSVSplitOffsetRHS11.length; i++) {
    const columns = CSVSplitOffsetRHS11[i].split(',');
    const lat = parseFloat(columns[0]);
    const lng = parseFloat(columns[1]);
    const Chainage = parseFloat(columns[2]);
    if(!isNaN(lat) && !isNaN(lng))
    {
      var temp = {
        lat : lat,
        lng : lng,
        chainage : Chainage 
      }
      OffsetRHSLine11Arr.push(temp);
    } 
   }
                 //*********************Converting Offset RHSLine11 *********************/
                 var CSVSplitOffsetRHS12 = OffsetRHSLine12CSV.split('\n');
                 for (var i = 0; i < CSVSplitOffsetRHS12.length; i++) {
                 const columns = CSVSplitOffsetRHS12[i].split(',');
                 const lat = parseFloat(columns[0]);
                 const lng = parseFloat(columns[1]);
                 const Chainage = parseFloat(columns[2]);
                 if(!isNaN(lat) && !isNaN(lng))
                 {
                   var temp = {
                     lat : lat,
                     lng : lng,
                     chainage : Chainage 
                   }
                   OffsetRHSLine12Arr.push(temp);
                 } 
                }
        //*********************Converting Offset RHSLine3 *********************/
        var CSVSplitOffsetRHS3 = OffsetRHSLine3CSV.split('\n');
        for (var i = 0; i < CSVSplitOffsetRHS3.length; i++) {
        const columns = CSVSplitOffsetRHS3[i].split(',');
        const lat = parseFloat(columns[0]);
        const lng = parseFloat(columns[1]);
        const Chainage = parseFloat(columns[2]);
        if(!isNaN(lat) && !isNaN(lng))
        {
          var temp = {
            lat : lat,
            lng : lng,
            chainage : Chainage 
          }
          OffsetRHSLine3Arr.push(temp);
        } 
       }   
               //*********************Converting Offset LHSLine3 *********************/
               var CSVSplitOffsetLHS3 = OffsetLHSLine3CSV.split('\n');
               for (var i = 0; i < CSVSplitOffsetLHS3.length; i++) {
               const columns = CSVSplitOffsetLHS3[i].split(',');
               const lat = parseFloat(columns[0]);
               const lng = parseFloat(columns[1]);
               const Chainage = parseFloat(columns[2]);
               if(!isNaN(lat) && !isNaN(lng))
               {
                 var temp = {
                   lat : lat,
                   lng : lng,
                   chainage : Chainage 
                 }
                 OffsetLHSLine3Arr.push(temp);
               } 
              }        
              


plottingMeadianRHS()
plottingMeadianLHS()
plottingOffsetLHSLine1()
plottingOffsetLHSLine2()
fillAreaBetweenLines()
fillAreaBetweenOffsetLHSLine1()
fillAreaBetweenOffsetLHSLine2()




plottingOffsetLine(OffsetRHSLine1Arr)
plottingOffsetLine(OffsetRHSLine2Arr)

fillAreaBetweenOffsetRHSLine1()
fillAreaBetweenOffsetRHSLine2()


//  plottingOffsetLine(OffsetRHSLine3Arr)
//  plottingOffsetLine(OffsetLHSLine3Arr)
 
 fillAreaBetweenOffsetRHSLine3()
 fillAreaBetweenOffsetLHSLine3()

 BridgePlotting()

 ServiceRoadPlotting()
 plottingOffsetDashedLine(OffsetLHSLine11Arr);
 plottingOffsetDashedLine(OffsetLHSLine12Arr);
 plottingOffsetDashedLine(OffsetRHSLine11Arr);
 plottingOffsetDashedLine(OffsetRHSLine12Arr);

 var startDateOneWeek = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() -7);
var endDateOneWeek = new Date();
var date = new Date(startDateOneWeek);
var date1 = new Date(endDateOneWeek);
var formattedDate = formatDate(date);
var formattedDate1 = formatDate(date1);
var From_Date = document.getElementById('Fdate');
var To_Date = document.getElementById('Tdate');
From_Date.innerHTML = formattedDate.replaceAll('/', '-');
To_Date.innerHTML = formattedDate1.replaceAll('/', '-');
function formatDate(date) {
  var day = String(date.getDate()).padStart(2, '0');
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var month = monthNames[date.getMonth()];
  var year = date.getFullYear();
  return day + '-' + month + '-' + year;
}
  defectcallbackFunction('Defect', 'All', '', formatDate(startDateOneWeek), formatDate(endDateOneWeek));

 google.maps.event.addListener(map, 'zoom_changed', function () {
    var currentZoomLevel = map.getZoom();
  });

 var executedAtZoom17 = false; // Flag to track if functions have been executed at zoom level 17
var executedAtZoom17 = false; // Flag to track if functions have been executed at zoom level 17
//PlottingAssetsMarkers();
google.maps.event.addListener(map, 'zoom_changed', function () {

    var currentZoomLevel = map.getZoom();
    if (currentZoomLevel >= 17 && !executedAtZoom17) {
    //   showLoadingSpinner();
    // // Simulate loading data (e.g., with setTimeout)
    // setTimeout(function() {
    //   hideLoadingSpinner();
    // }, 5000);    
    //     // EarthworksAndMainTrack(CenterLineArr);
    //     for(var i = 0 ; i < 2 ; i++)
    //     {
    //       plottingOffsetDashedLine(OffsetLHSLine11Arr);
    //       plottingOffsetDashedLine(OffsetLHSLine12Arr);
    //       plottingOffsetDashedLine(OffsetRHSLine11Arr);
    //       plottingOffsetDashedLine(OffsetRHSLine12Arr);
    //     }
      
        //Plotting Assets
    //    PlottingAssetsMarkers();

        executedAtZoom17 = true; // Set the flag to true
    } else if (currentZoomLevel < 17 && executedAtZoom17) {
      //Removing Assets
   //   RemovePlottingAssetsMarker();

      //Remove Dashed line
     // RemoveDashedLine();
        executedAtZoom17 = false; // Reset the flag when zoom level goes below 17
    }
});
}

function getStrokeWeight(zoomLevel) {

  // Define a base weight, then adjust based on the zoom level
  var baseWeight = 1; // Change this to your preferred base weight
  return baseWeight / Math.pow(2, zoomLevel - 14); // Adjust the divisor as needed to control scaling
}

function plottingMeadianRHS() {
  // Convert the array of coordinates into a GeoJSON format
  var geojson = {
      "type": "FeatureCollection",
      "features": [{
          "type": "Feature",
          "geometry": {
              "type": "LineString",
              "coordinates": MeadianRHSArr.map(function(coord) {
                  return [coord.lng, coord.lat];
              })
          },
          "properties": {}
      }]
  };
  var feature = map.data.addGeoJson(geojson, {});

  // Get the current zoom level
  var currentZoom = map.getZoom();

  // Set the stroke weight based on the zoom level
  var strokeWeight = getStrokeWeight(currentZoom);

  // Apply the style
  map.data.overrideStyle(feature[0], {
      strokeColor: 'black',
      strokeWeight: strokeWeight
  });

  // Add an event listener to adjust the stroke weight when the zoom level changes
  map.addListener('zoom_changed', function() {
      var newZoom = map.getZoom();
      var newStrokeWeight = getStrokeWeight(newZoom);
      map.data.overrideStyle(feature[0], {
          strokeColor: 'black',
          strokeWeight: newStrokeWeight
      });
  });
}

function plottingMeadianLHS() {
  // Convert the array of coordinates into a GeoJSON format
  var geojson = {
      "type": "FeatureCollection",
      "features": [{
          "type": "Feature",
          "geometry": {
              "type": "LineString",
              "coordinates": MeadianLHSArr.map(function(coord) {
                  return [coord.lng, coord.lat];
              })
          },
          "properties": {}
      }]
  }; 
  var feature = map.data.addGeoJson(geojson, {});

  // Get the current zoom level
  var currentZoom = map.getZoom();

  // Set the stroke weight based on the zoom level
  var strokeWeight = getStrokeWeight(currentZoom);

  // Apply the style
  map.data.overrideStyle(feature[0], {
      strokeColor: 'black',
      strokeWeight: strokeWeight
  });

  // Add an event listener to adjust the stroke weight when the zoom level changes
  map.addListener('zoom_changed', function() {
      var newZoom = map.getZoom();
      var newStrokeWeight = getStrokeWeight(newZoom);
      map.data.overrideStyle(feature[0], {
          strokeColor: 'black',
          strokeWeight: newStrokeWeight
      });
  });
}

function plottingOffsetLHSLine1() {
    // Convert the array of coordinates into a GeoJSON format
    var geojson = {
      "type": "FeatureCollection",
      "features": [{
          "type": "Feature",
          "geometry": {
              "type": "LineString",
              "coordinates": OffsetLHSLine1Arr.map(function(coord) {
                  return [coord.lng, coord.lat];
              })
          },
          "properties": {}
      }]
  };
  var feature = map.data.addGeoJson(geojson, {});

  // Get the current zoom level
  var currentZoom = map.getZoom();

  // Set the stroke weight based on the zoom level
  var strokeWeight = getStrokeWeight(currentZoom);

  // Apply the style
  map.data.overrideStyle(feature[0], {
      strokeColor: 'black',
      strokeWeight: strokeWeight
  });

  // Add an event listener to adjust the stroke weight when the zoom level changes
  map.addListener('zoom_changed', function() {
      var newZoom = map.getZoom();
      var newStrokeWeight = getStrokeWeight(newZoom);
      map.data.overrideStyle(feature[0], {
          strokeColor: 'black',
          strokeWeight: newStrokeWeight
      });
  });
}


function plottingOffsetLHSLine2() {
  // Convert the array of coordinates into a GeoJSON format
  var geojson = {
      "type": "FeatureCollection",
      "features": [{
          "type": "Feature",
          "geometry": {
              "type": "LineString",
              "coordinates": OffsetLHSLine2Arr.map(function(coord) {
                  return [coord.lng, coord.lat];
              })
          },
          "properties": {}
      }]
  };
  var feature = map.data.addGeoJson(geojson, {});

  // Get the current zoom level
  var currentZoom = map.getZoom();

  // Set the stroke weight based on the zoom level
  var strokeWeight = getStrokeWeight(currentZoom);

  // Apply the style
  map.data.overrideStyle(feature[0], {
      strokeColor: 'black',
      strokeWeight: strokeWeight
  });

  // Add an event listener to adjust the stroke weight when the zoom level changes
  map.addListener('zoom_changed', function() {
      var newZoom = map.getZoom();
      var newStrokeWeight = getStrokeWeight(newZoom);
      map.data.overrideStyle(feature[0], {
          strokeColor: 'black',
          strokeWeight: newStrokeWeight
      });
  });
}

function plottingOffsetLine(arr) {
  // Convert the array of coordinates into a GeoJSON format
  var geojson = {
      "type": "FeatureCollection",
      "features": [{
          "type": "Feature",
          "geometry": {
              "type": "LineString",
              "coordinates": arr.map(function(coord) {
                  return [coord.lng, coord.lat];
              })
          },
          "properties": {}
      }]
  };
  var feature = map.data.addGeoJson(geojson, {});

  // Get the current zoom level
  var currentZoom = map.getZoom();

  // Set the stroke weight based on the zoom level
  var strokeWeight = getStrokeWeight(currentZoom);

  // Apply the style
  map.data.overrideStyle(feature[0], {
      strokeColor: 'black',
      strokeWeight: strokeWeight
  });

  // Add an event listener to adjust the stroke weight when the zoom level changes
  map.addListener('zoom_changed', function() {
      var newZoom = map.getZoom();
      var newStrokeWeight = getStrokeWeight(newZoom);
      map.data.overrideStyle(feature[0], {
          strokeColor: 'black',
          strokeWeight: newStrokeWeight
      });
  });
}
function fillAreaBetweenLines() {
  // Create an array of coordinates for the polygon
  var polygonCoords = [];
  for (var i = 0; i < MeadianRHSArr.length; i++) {
      polygonCoords.push({ lat: MeadianRHSArr[i].lat, lng: MeadianRHSArr[i].lng });
  }
  for (var i = MeadianLHSArr.length - 1; i >= 0; i--) {
      polygonCoords.push({ lat: MeadianLHSArr[i].lat, lng: MeadianLHSArr[i].lng });
  }
  // Convert the array of coordinates into a GeoJSON format
  var polygon = new google.maps.Polygon({
    paths: polygonCoords,
    strokeColor: 'white',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: 'green',
    fillOpacity: 1
});
polygon.setMap(map);
}
//***************************Offset LHSLine 1 Colour Fill******************* */
function fillAreaBetweenOffsetLHSLine1() {
  // Create an array of coordinates for the polygon
  var polygonCoords = [];
  for (var i = 0; i < OffsetLHSLine1Arr.length; i++) {
      polygonCoords.push({ lat: OffsetLHSLine1Arr[i].lat, lng: OffsetLHSLine1Arr[i].lng });
  }
  for (var i = MeadianLHSArr.length - 1; i >= 0; i--) {
      polygonCoords.push({ lat: MeadianLHSArr[i].lat, lng: MeadianLHSArr[i].lng });
  }
  // Convert the array of coordinates into a GeoJSON format
  var polygon = new google.maps.Polygon({
    paths: polygonCoords,
    strokeColor: 'white',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: 'black',
    fillOpacity: 1
});
polygon.setMap(map);
}

//***************************Offset LHSLine 2 Colour Fill******************* */
function fillAreaBetweenOffsetLHSLine2() {
  // Create an array of coordinates for the polygon
  var polygonCoords = [];
  var pointsWithChainage = []; // Array to store points with their chainage

  for (var i = 0; i < OffsetLHSLine1Arr.length; i++) {
      var point = { lat: OffsetLHSLine1Arr[i].lat, lng: OffsetLHSLine1Arr[i].lng, chainage: OffsetLHSLine1Arr[i].chainage };
      polygonCoords.push({ lat: point.lat, lng: point.lng });
      pointsWithChainage.push(point);
  }
  for (var i = OffsetLHSLine2Arr.length - 1; i >= 0; i--) {
      var point = { lat: OffsetLHSLine2Arr[i].lat, lng: OffsetLHSLine2Arr[i].lng, chainage: OffsetLHSLine2Arr[i].chainage };
      polygonCoords.push({ lat: point.lat, lng: point.lng });
      pointsWithChainage.push(point);
  }

  // Convert the array of coordinates into a GeoJSON format
  var polygon = new google.maps.Polygon({
      paths: polygonCoords,
      strokeColor: 'white',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: 'black',
      fillOpacity: 1
  });
  polygon.setMap(map);

  // Add a click event listener to the polygon

  google.maps.event.addListener(polygon, 'click', function(event) {
      var clickedLatLng = event.latLng;
       nearestPoint = findNearestPoint(clickedLatLng, pointsWithChainage);
      if (nearestPoint) {

        showInfoWindow(clickedLatLng, 'Chainage: ' + nearestPoint.chainage);

      }
  });
}

// Function to find the nearest point with chainage
function findNearestPoint(clickedLatLng, pointsWithChainage) {
  var minDist = Number.MAX_VALUE;
  var nearestPoint = null;

  pointsWithChainage.forEach(function(point) {
      var pointLatLng = new google.maps.LatLng(point.lat, point.lng);
      var dist = google.maps.geometry.spherical.computeDistanceBetween(clickedLatLng, pointLatLng);
      if (dist < minDist) {
          minDist = dist;
          nearestPoint = point;
      }
  });

  return nearestPoint;
}

function showInfoWindow(latLng, content) {
  console.log(nearestPoint.chainage)
  // Remove the current overlay if it exists
  if (currentOverlay) {
      currentOverlay.setMap(null);
  }

  var infoWindowDiv = document.createElement('div');
  infoWindowDiv.className = 'chainage-info-window';
  var createDefectURL = 'https://creatorapp.zoho.in/rcidmaplehwmis/highway-maintenance-system/#Form:Defect_Creation?From_GIS=true&Static_Chainage=' + nearestPoint.chainage;
  
  infoWindowDiv.innerHTML = `
    <button class="close-button">&times;</button>
    ${content}
    <div class="dropdown">
        <div class="dropdown-menu" style="display: block; margin-top: 10px;">
            <a href="${createDefectURL}" target="_blank">Create Defect</a>
        </div>
    </div>
  `;

  var overlay = new google.maps.OverlayView();
  overlay.onAdd = function() { 
      var layer = this.getPanes().floatPane;
      layer.appendChild(infoWindowDiv);
  };

  // Add event listener for the close button
  var closeButton = infoWindowDiv.querySelector('.close-button');
  closeButton.addEventListener('click', function() {
      if (currentOverlay) {
          currentOverlay.setMap(null);
          currentOverlay = null;
      }
  });

  overlay.draw = function() {
      var projection = this.getProjection();
      var position = projection.fromLatLngToDivPixel(latLng);
      infoWindowDiv.style.left = position.x + 'px';
      infoWindowDiv.style.top = position.y + 'px';
  };
  overlay.onRemove = function() {
      infoWindowDiv.parentNode.removeChild(infoWindowDiv);
      overlay = null;
  };
  overlay.setMap(map);

  // Update the current overlay reference
  currentOverlay = overlay;
}
//***************************Offset RHSLine 1 Colour Fill******************* */
function fillAreaBetweenOffsetRHSLine1() {
  // Create an array of coordinates for the polygon
  var polygonCoords = [];
  for (var i = 0; i < OffsetRHSLine1Arr.length; i++) {
      polygonCoords.push({ lat: OffsetRHSLine1Arr[i].lat, lng: OffsetRHSLine1Arr[i].lng });
  }
  for (var i = MeadianRHSArr.length - 1; i >= 0; i--) {
      polygonCoords.push({ lat: MeadianRHSArr[i].lat, lng: MeadianRHSArr[i].lng });
  }
  // Convert the array of coordinates into a GeoJSON format
  var polygon = new google.maps.Polygon({
    paths: polygonCoords,
    strokeColor: 'white',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: 'black',
    fillOpacity: 1
});
polygon.setMap(map);
}
//***************************Offset RHSLine 2 Colour Fill******************* */
function fillAreaBetweenOffsetRHSLine2() {
  // Create an array of coordinates for the polygon
  var polygonCoords = [];
  var pointsWithChainage = []; 
  for (var i = 0; i < OffsetRHSLine1Arr.length; i++) {
    var point = { lat: OffsetRHSLine1Arr[i].lat, lng: OffsetRHSLine1Arr[i].lng, chainage: OffsetRHSLine1Arr[i].chainage };
      polygonCoords.push({ lat: point.lat, lng: point.lng });
      pointsWithChainage.push(point);
  }
  for (var i = OffsetRHSLine2Arr.length - 1; i >= 0; i--) {
    var point = { lat: OffsetRHSLine2Arr[i].lat, lng: OffsetRHSLine2Arr[i].lng, chainage: OffsetRHSLine2Arr[i].chainage };
    polygonCoords.push({ lat: point.lat, lng: point.lng });
    pointsWithChainage.push(point);
  }
  // Convert the array of coordinates into a GeoJSON format
  var polygon = new google.maps.Polygon({
    paths: polygonCoords,
    strokeColor: 'white',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: 'black',
    fillOpacity: 1
});
polygon.setMap(map);

  // Add a click event listener to the polygon
  google.maps.event.addListener(polygon, 'click', function(event) {
    var clickedLatLng = event.latLng;
     nearestPoint = findNearestPoint(clickedLatLng, pointsWithChainage);
    if (nearestPoint) {
      showInfoWindow(clickedLatLng, 'Chainage: ' + nearestPoint.chainage);
    }
});
}


function fillAreaBetweenOffsetRHSLine3() {
  // Create an array of coordinates for the polygon
  var polygonCoords = [];
  // Push coordinates from OffsetRHSLine2Arr
  for (var i = 0; i < OffsetRHSLine3Arr.length; i++) {
    polygonCoords.push({ lat: OffsetRHSLine3Arr[i].lat, lng: OffsetRHSLine3Arr[i].lng });
  }
  // Push coordinates from OffsetRHSLine3Arr in reverse order
  for (var i = OffsetRHSLine2Arr.length - 1; i >= 0; i--) {
    polygonCoords.push({ lat: OffsetRHSLine2Arr[i].lat, lng: OffsetRHSLine2Arr[i].lng });
  }
  // Convert the array of coordinates into a GeoJSON format
  var polygon = new google.maps.Polygon({
    paths: polygonCoords,
    strokeColor: 'white',
    strokeOpacity: 1,
    strokeWeight: 2,
    fillColor: 'brown',
    fillOpacity: 1
  });
  polygon.setMap(map);
}
function fillAreaBetweenOffsetLHSLine3() {
  // Create an array of coordinates for the polygon
  var polygonCoords = [];
  // Push coordinates from OffsetRHSLine2Arr
  for (var i = 0; i < OffsetLHSLine3Arr.length; i++) {
    polygonCoords.push({ lat: OffsetLHSLine3Arr[i].lat, lng: OffsetLHSLine3Arr[i].lng });
  }
  // Push coordinates from OffsetRHSLine3Arr in reverse order
  for (var i = OffsetLHSLine2Arr.length - 1; i >= 0; i--) {
    polygonCoords.push({ lat: OffsetLHSLine2Arr[i].lat, lng: OffsetLHSLine2Arr[i].lng });
  }
  // Convert the array of coordinates into a GeoJSON format
  var polygon = new google.maps.Polygon({
    paths: polygonCoords,
    strokeColor: 'white',
    strokeOpacity: 1,
    strokeWeight: 2,
    fillColor: 'brown',
    fillOpacity: 1
  });
  polygon.setMap(map);
}


function plottingOffsetDashedLine(arr) {

 
  var path = arr.map(function(coord) {
      return { lat: coord.lat, lng: coord.lng };
  });
  const lineSymbol = {
    path: "M 0,-1 0,1",
    strokeOpacity: 1,
    scale: 4,
  };

  var polyline = new google.maps.Polyline({
      path: path,
      strokeColor: 'white',
      strokeWeight: 0,
      map: map,
      icons: [{
          icon: {
              path: 'M 0,-1 0,1',
              strokeOpacity: 0.95,
              scale: 4
          },
          offset: '0',
          repeat: '20px'
      }]
  });
  DashedLineRemove.push(polyline);
 
   
    
}

function RemoveDashedLine()
{
//  console.log(DashedLineRemove);
  for (let i = 0; i < DashedLineRemove.length; i++) {
    DashedLineRemove[i].setMap(null); // Set the map property to null to remove the circle from the map
  }
  DashedLineRemove = []; 

}


/**
 * Service road plotting
 */
function ServiceRoadPlotting()
{

  var CSVSplitServiceRoadFile = ServiceRoadFileCSV.split('\n');
  var coordinatesString;
 // console.log(CSVSplitServiceRoadFile)
                 for (var i = 1; i < CSVSplitServiceRoadFile.length; i++) {
                 const columns = CSVSplitServiceRoadFile[i].split('|,');
                 const ServiceRoad_No = (columns[0]);
                 const Side = (columns[1]);
                 const From = (columns[2]);
                 const To = (columns[3]);
                 const Length = (columns[4]);
                 const Width = (columns[5]);
                 const Coordinate = (columns[6]);

               //  console.log(Coordinate);
                 if (Coordinate) {
                   coordinatesString = Coordinate.slice(1, -3);
                   
                //  console.log("After Trim - > "+coordinatesString);
              } else {
                 // console.log("coordinatesString is undefined or empty");
              }
                 if(ServiceRoad_No != '')
                 {
                   var temp = {
                      ServiceRoad_No : ServiceRoad_No,
                      Side : Side,
                      To : To ,
                      From : From,
                      Length:Length,
                      Width :Width,
                      Coordinate : coordinatesString
                   }
                   ServiceRoadFileArr.push(temp);
                 } 
                } 
                //console.log(ServiceRoadFileArr)
                
                //let formattedOutput = [JSON.parse(ServiceRoadFileArr[1]['Coordinate'])].map(coord => '[[' + coord.join('],[ ') + ']]').join(',\n');
               // console.log((JSON.parse(formattedOutput)))
              // Format the output
              for(var i = 0 ; i < ServiceRoadFileArr.length ; i++)
              {
                let formattedOutput = [JSON.parse(ServiceRoadFileArr[i]['Coordinate'])].map(coord => '[[' + coord.join('],[ ') + ']]').join(',\n');
                var geojson1 = {
                  "type": "FeatureCollection",
                  "features": [
                  { "type": "Feature", "properties": { 
                    "ServiceRoadNo": ServiceRoadFileArr[i]['ServiceRoad_No'],
                    "From": ServiceRoadFileArr[i]['From'],
                    "To": ServiceRoadFileArr[i]['To'],
                    "Length": ServiceRoadFileArr[i]['Length'],
                    "Width": ServiceRoadFileArr[i]['Width'],
                  },
                   "geometry": { "type": "Polygon", 
                  "coordinates": [((JSON.parse(formattedOutput)))]
                },
                }
                  ]
              };
              var infoWindow = new google.maps.InfoWindow();
              map.data.addListener('mouseover', function (event) {
                if (event.feature.getProperty('ServiceRoadNo')) {

                    infoWindow.setContent(
                    "<strong>ServiceRoad No : " + event.feature.getProperty('ServiceRoadNo')
                    + "<br></strong>From : " + event.feature.getProperty('From')
                    + "<br></strong>To : " + event.feature.getProperty('To')
                    + "<br></strong>Length : " + event.feature.getProperty('Length')
                    + "<br></strong>Width : " + event.feature.getProperty('Width')
                    )
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map);
                }
            });
            
            map.data.addListener('mouseout', function () {
                infoWindow.close();
            });
            var feature1 = map.data.addGeoJson(geojson1, {});
              map.data.overrideStyle(feature1[0], {
                  strokeColor: 'gray',
                  strokeWeight: 2,
                  fillOpacity : 0.8,
                 fillColor : 'gray'
              }); 
              }

}


 /**
  * Bridge Plotting 
  */
function BridgePlotting() {
   
  var CSVSplitBridgeFile = BridgeFileCSV.split('\n');
  var coordinatesString;
 // console.log(CSVSplitBridgeFile)
                 for (var i = 1; i < CSVSplitBridgeFile.length; i++) {
                 const columns = CSVSplitBridgeFile[i].split('|,');
                 const BridgeType = (columns[0]);
                 const Bridge_No = (columns[1]);
                 const Chainage = (columns[2]);
                 const Side = (columns[3]);
                 const Proposed_treatment = (columns[4]);
                 const Coordinate = (columns[5]);
               //  console.log(Coordinate);
                 if (Coordinate) {
                   coordinatesString = Coordinate.slice(1, -3);
                //  console.log("After Trim - > "+coordinatesString);
              } else {
                 // console.log("coordinatesString is undefined or empty");
              }
                 if(Bridge_No != '' && Chainage != undefined)
                 {
                   var temp = {
                     BridgeType : BridgeType,
                      Bridge_No : Bridge_No,
                      Side : Side,
                     chainage : Chainage ,
                     Proposed_treatment : Proposed_treatment,
                     Coordinate : coordinatesString
                   }
                   BridgeFileArr.push(temp);
                 } 
                } 
                //console.log(BridgeFileArr)
                
                let formattedOutput = [JSON.parse(BridgeFileArr[1]['Coordinate'])].map(coord => '[[' + coord.join('],[ ') + ']]').join(',\n');
               // console.log((JSON.parse(formattedOutput)))
              // Format the output
              for(var i = 0 ; i < BridgeFileArr.length ; i++)
              {
                let formattedOutput = [JSON.parse(BridgeFileArr[i]['Coordinate'])].map(coord => '[[' + coord.join('],[ ') + ']]').join(',\n');
               // console.log((JSON.parse(formattedOutput)))
                var geojson1 = {
                  "type": "FeatureCollection",
                  "features": [{
                      "type": "Feature",
                      "geometry": {
                          "type": "LineString",
                          "coordinates": ((JSON.parse(formattedOutput)))
                          
                      },
                      "properties": {
                        "bridgeNo": BridgeFileArr[i]['Bridge_No'],
                        "bridgeType": BridgeFileArr[i]['BridgeType'],
                        "chainage": BridgeFileArr[i]['chainage'],
                      }
                  }]
              };
              var infoWindow = new google.maps.InfoWindow();
              map.data.addListener('mouseover', function (event) {
                if (event.feature.getProperty('bridgeNo')) {
                    infoWindow.setContent("<strong class='chainage'>Bridge No : " + event.feature.getProperty('bridgeNo')
                    + "<br></strong>Bridge Type : " + event.feature.getProperty('bridgeType')
                    + "<br></strong>Bridge Chainage : " + event.feature.getProperty('chainage')
                    )
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map);
                }
            });
            
            map.data.addListener('mouseout', function () {
                infoWindow.close();
            });
            //   var BridgePolyline = new google.maps.Polyline({
            //     //path: ((JSON.parse(formattedOutput))),
            //     geodesic: true,
            //   //  strokeColor: color,
            //     strokeOpacity: 1.0,
            //     strokeWeight: 2,
            //     structure: "Bridge",
            //     structureNo: BridgeFileArr[i]['Bridge_No'],
            // });
      
            // BridgePolyline.addListener('mouseover', function (event) {
            //   BridgeInfoBox(BridgeFileArr, event);
            // });
      
            // BridgePolyline.addListener('mouseout', function () {
            //     infoWindow.close();
            // });
            //   // BridgeFileArr.addListener('mouseover', function () {
            //   //   BridgeInfoBox(BridgeFileArr);
            //   // });
            var feature1 = map.data.addGeoJson(geojson1, {});
              map.data.overrideStyle(feature1[0], {
                  strokeColor: 'red',
                  strokeWeight: 5
              }); 
              }

              PlottingProjectAssets();
            
  }
function PlottingProjectAssets()
{
  
  OffsetLHSLine3Arr //--> LHS Unpaved Line
  OffsetRHSLine3Arr //--> RHS Unpaved Line
  MainCSV //--> Main Still in CSv
  
  //*********************Converting Meadian *********************/
 var CSVSplitMeadian = MainCSV.split('\n');
 for (var i = 0; i < CSVSplitMeadian.length; i++) {
 const columns = CSVSplitMeadian[i].split(',');
 const lat = parseFloat(columns[0]);
 const lng = parseFloat(columns[1]);
 const Chainage = parseFloat(columns[2]);
 if(!isNaN(lat) && !isNaN(lng))
 {
   var temp = {
     lat : lat,
     lng : lng,
     chainage : Chainage 
   }
   MainCSVArr.push(temp);
 } 
}

for(var k = 0 ; k < recordArrProjectAssets.length;k++){
  //console.log(recordArrProjectAssets[k])
// for(var i = 0 ; i < recordArrProjectAssets[k].length ; i++)
// {
 
   if(recordArrProjectAssets[k]['Level1_Master']['display_value'] == 'Median')
   {
     var lat,lng;
       for(var j = 0 ; j < MainCSVArr.length ; j++ )
       {
        if( MainCSVArr[j]['chainage'] == recordArrProjectAssets[k]['Static_Chainage'])
        {         
          lat = MainCSVArr[j]['lat'];
          lng = MainCSVArr[j]['lng']
        }
       }
        var temp = {
        Asset : recordArrProjectAssets[k]['AssetCategory']['display_value'],
        AssetSubCategory:recordArrProjectAssets[k]['Asset_Sub_Category']['display_value'],
        Chainage : recordArrProjectAssets[k]['Static_Chainage'],
        side : recordArrProjectAssets[k]['Level1_Master']['display_value'],
        Latlng : {lat,lng},
        map: map,
      }   
      MeadianAssetsArr.push(temp);
   }
   if(recordArrProjectAssets[k]['Level1_Master']['display_value'] == 'LHS')
   {
    
    var lat,lng;
    for(var j = 0 ; j < OffsetLHSLine3Arr.length ; j++ )
    {
     if( OffsetLHSLine3Arr[j]['chainage'] == recordArrProjectAssets[k]['Static_Chainage'])
     {         
       lat = OffsetLHSLine3Arr[j]['lat'];
       lng = OffsetLHSLine3Arr[j]['lng']
     }
    }
    var temp = {
      Asset : recordArrProjectAssets[k]['AssetCategory']['display_value'],
      AssetSubCategory:recordArrProjectAssets[k]['Asset_Sub_Category']['display_value'],
      Chainage : recordArrProjectAssets[k]['Static_Chainage'],
      side : recordArrProjectAssets[k]['Level1_Master']['display_value'],
      Latlng : {lat,lng}
    }   
    LHSAssetsArr.push(temp);
   }
   if(recordArrProjectAssets[k]['Level1_Master']['display_value'] == 'RHS')
   {
    var lat,lng;
    for(var j = 0 ; j < OffsetRHSLine3Arr.length ; j++ )
    {
     if( OffsetRHSLine3Arr[j]['chainage'] == recordArrProjectAssets[k]['Static_Chainage'])
     {         
       lat = OffsetRHSLine3Arr[j]['lat'];
       lng = OffsetRHSLine3Arr[j]['lng']
     }
    }
    var temp = {
      Asset : recordArrProjectAssets[k]['AssetCategory']['display_value'],
      AssetSubCategory:recordArrProjectAssets[k]['Asset_Sub_Category']['display_value'],
      Chainage : recordArrProjectAssets[k]['Static_Chainage'],
      side : recordArrProjectAssets[k]['Level1_Master']['display_value'],
      Latlng : {lat,lng},
    } 
    RHSAssetsArr.push(temp);
   }
   if(recordArrProjectAssets[k]['Level1_Master']['display_value'] == 'BHS')
   {
    var lat1,lng1,lat2,lng2;
    for(var j = 0 ; j < OffsetRHSLine3Arr.length ; j++ )
    {
      if(OffsetRHSLine3Arr[j]['chainage'] == recordArrProjectAssets[k]['Static_Chainage'])
      {         
        lat1 = OffsetRHSLine3Arr[j]['lat'];
        lng1 = OffsetRHSLine3Arr[j]['lng']
      }
    }
    for(var j = 0 ; j < OffsetLHSLine3Arr.length ; j++ )
    {
      if(OffsetLHSLine3Arr[j]['chainage'] == recordArrProjectAssets[k]['Static_Chainage'])
      {         
        lat2 = OffsetLHSLine3Arr[j]['lat'];
        lng2 = OffsetLHSLine3Arr[j]['lng']
      }
    }
    var temp1 = {
      Asset : recordArrProjectAssets[k]['AssetCategory']['display_value'],
      AssetSubCategory:recordArrProjectAssets[k]['Asset_Sub_Category']['display_value'],
      Chainage : recordArrProjectAssets[k]['Static_Chainage'],
      Latlng : {lat: lat1, lng: lng1},
      side : 'RHS',
    } 
    var temp2 = {
      Asset : recordArrProjectAssets[k]['AssetCategory']['display_value'],
      AssetSubCategory:recordArrProjectAssets[k]['Asset_Sub_Category']['display_value'],
      Chainage : recordArrProjectAssets[k]['Static_Chainage'],
      Latlng : {lat: lat2, lng: lng2},
      side : 'LHS',
    } 
    BHSAssetsArr.push(temp1);
    BHSAssetsArr.push(temp2);
   }
  }


}
//}
          
// Array to keep track of all markers
var markers = [];

function handleToggle(category, side, isChecked, subCategory) {
  console.log(`Category: ${category}, Side: ${side}, Checked: ${isChecked}, SubCategory: ${subCategory}`);
  console.log("LHSAssetsArr");
  var arrays = [LHSAssetsArr, RHSAssetsArr, MeadianAssetsArr, BHSAssetsArr]; // Add your additional arrays here

  // If the checkbox is untoggled, remove the markers for the specified category and side
  if (!isChecked) {
    removeMarkers(category, side, subCategory);
    return;
  }

  for (var j = 0; j < arrays.length; j++) {
    var currentArray = arrays[j];

    for (var i = 0; i < currentArray.length; i++) {
      var anchorX = 35; // Default anchor X
      var anchorY = 35; // Default anchor Y
      if (currentArray[i]['side'] === 'RHS') { // Correct property name
        anchorX = 20; // Adjust anchor X for RHS
        anchorY = 20; // Adjust anchor Y for RHS
      }

      let downloadUrl = '';
      let matchedAsset = false;

      // Check for Asset and AssetSubCategory being defined
      if (currentArray[i]['Asset'] !== '' && currentArray[i]['AssetSubCategory'] !== undefined) {
        console.log(currentArray[i]['AssetSubCategory'] + " - " + subCategory + " / " + currentArray[i]['Asset'] + " - " + category);
        for (var k = 0; k < recordArrAssetsImage.length; k++) {
          if (currentArray[i]['Asset'] === category && currentArray[i]['AssetSubCategory'] === subCategory) {
            if (recordArrAssetsImage[k]['Asset_Category']['display_value'] === category && recordArrAssetsImage[k]['Level1']['display_value'] === side && currentArray[i]['side'] === side) {
              
              var apiAssetImage = recordArrAssetsImage[k]['Image'];
              var parts = apiAssetImage.split('/');
              var partsFilepath = apiAssetImage.split('?filepath=');
              downloadUrl = 'https://creatorexport.zoho.in/file/rcidmaplehwmis/highway-maintenance-system/Assets_category_and_sub_category_master_Report/' + parts[7] + '/Image/image-download?filepath=/' + partsFilepath[1];
              matchedAsset = true;
            }
          }
        }
        if (matchedAsset) {
         
          createMarker(currentArray[i], downloadUrl, category, side, subCategory, isChecked);
        }
      }

      // Combined Check for Asset with undefined AssetSubCategory
      if (currentArray[i]['Asset'] !== '' && currentArray[i]['AssetSubCategory'] === undefined && currentArray[i]['Asset'] === category) {
        for (var k = 0; k < recordArrAssetsImage.length; k++) {
          if (recordArrAssetsImage[k]['Asset_Category']['display_value'] === category) {
            if (recordArrAssetsImage[k]['Level1']['display_value'] === side && currentArray[i]['side'] === side || recordArrAssetsImage[k]['Level1']['display_value'] === undefined) {
              var apiAssetImage = recordArrAssetsImage[k]['Image'];
              var parts = apiAssetImage.split('/');
              var partsFilepath = apiAssetImage.split('?filepath=');
              downloadUrl = 'https://creatorexport.zoho.in/file/rcidmaplehwmis/highway-maintenance-system/Assets_category_and_sub_category_master_Report/' + parts[7] + '/Image/image-download?filepath=/' + partsFilepath[1];
              createMarker(currentArray[i], downloadUrl, category, side, subCategory, isChecked);
            }
          }
        }
      }
    }
  }
}

function createMarker(assetData, downloadUrl, category, side, subCategory, isChecked) {

  var infowindowContent = 'Asset: ' + assetData['Asset'] + '<br>' +
    'Chainage: ' + assetData['Chainage'];

  var infowindow = new google.maps.InfoWindow({
    content: infowindowContent,
  });

  var iconDesign = {
    url: downloadUrl,
    scaledSize: new google.maps.Size(30, 30),
  };

  var AssetMarker = new google.maps.Marker({
    icon: iconDesign,
    animation: google.maps.Animation.DROP,
    position: assetData['Latlng'],
    map: map,
  });

  // Use a closure to capture the correct infowindow for each marker
  google.maps.event.addListener(AssetMarker, 'mouseover', (function (infowindow, AssetMarker) {
    return function () {
      infowindow.open(map, AssetMarker);
    };
  })(infowindow, AssetMarker));

  google.maps.event.addListener(AssetMarker, 'mouseout', (function (infowindow, AssetMarker) {
    return function () {
      infowindow.close();
    };
  })(infowindow, AssetMarker));

  markers.push({ marker: AssetMarker, category: category, side: side, subCategory: subCategory });

  if (!isChecked) {
    AssetMarker.setMap(null);
  } else {
    AssetMarker.setMap(map);
  }
}

function removeMarkers(category, side, subCategory) {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i].category === category && markers[i].side === side && markers[i].subCategory === subCategory) {
      markers[i].marker.setMap(null);
    }
  }
  // Remove markers from the array that are not on the map anymore
  markers = markers.filter(markerObj => markerObj.category !== category || markerObj.side !== side || markerObj.subCategory !== subCategory);
}

window.handleToggle = handleToggle;
window.defectcallbackFunction = defectcallbackFunction;







function PlottingAssetsMarkers() {
var arrays = [LHSAssetsArr, RHSAssetsArr, MeadianAssetsArr, BHSAssetsArr]; // Add your additional arrays here
for (var j = 0; j < arrays.length; j++) {
  var currentArray = arrays[j];

  for (var i = 0; i < currentArray.length; i++) {
    var anchorX = 35; // Default anchor X
    var anchorY = 35; // Default anchor Y
    if (currentArray[i]['side'] == 'RHS') { // Correct property name
      anchorX = 20; // Adjust anchor X for RHS
      anchorY = 20; // Adjust anchor Y for RHS
    }

    if (currentArray[i]['Asset'] != '' && currentArray[i]['AssetSubCategory'] != '' && currentArray[i]['AssetSubCategory'] != undefined) {

      for (var k = 0; k < recordArrAssetsImage.length; k++) {
        // Debug log to trace asset and subcategory matching
        if (currentArray[i]['Asset'] == recordArrAssetsImage[k]['Asset_Category']['display_value'] &&
            currentArray[i]['AssetSubCategory'] == recordArrAssetsImage[k]['Asset_Sub_Category']['display_value']) {
          if (recordArrAssetsImage[k]['Level1']['display_value'] != undefined && currentArray[i]['side'] == recordArrAssetsImage[k]['Level1']['display_value']) {
            var apiAssetImage = recordArrAssetsImage[k]['Image'];
            // Split the URL to get the filepath
            var parts = apiAssetImage.split('/');
            var partsFilepath = apiAssetImage.split('?filepath=');
            var downloadUrl = 'https://creatorexport.zoho.in/file/rcidmaplehwmis/highway-maintenance-system/Assets_category_and_sub_category_master_Report/' + parts[7] + '/Image/image-download?filepath=/' + partsFilepath[1];
          } else if (recordArrAssetsImage[k]['Level1']['display_value'] == undefined) {
            // Handle cases where 'Level1' is not defined
            var apiAssetImage = recordArrAssetsImage[k]['Image'];
            // Split the URL to get the filepath
            var parts = apiAssetImage.split('/');
            var partsFilepath = apiAssetImage.split('?filepath=');
            var downloadUrl = 'https://creatorexport.zoho.in/file/rcidmaplehwmis/highway-maintenance-system/Assets_category_and_sub_category_master_Report/' + parts[7] + '/Image/image-download?filepath=/' + partsFilepath[1];
          }
        }
      }
    }
  
      if(currentArray[i]['Asset'] != '' && currentArray[i]['AssetSubCategory'] == undefined)
      {     
        for(var k = 0 ; k < recordArrAssetsImage.length ; k++){
         // console.log(recordArrAssetsImage[k]['Asset_Category']['display_value']+" / "+ currentArray[i]['Asset'] +" -> "+currentArray[i]['AssetSubCategory'] +" / "+recordArrAssetsImage[k]['Asset_Sub_Category']['display_value']);
          if(currentArray[i]['Asset'] == recordArrAssetsImage[k]['Asset_Category']['display_value']){
            var apiAssetImage = recordArrAssetsImage[k]['Image'];
            // Split the URL to get the filepath
            var parts = apiAssetImage.split('/');
            var partsFilepath = apiAssetImage.split('?filepath=');
            // Construct the new image download URL
            var downloadUrl = 'https://creatorexport.zoho.in/file/rcidmaplehwmis/highway-maintenance-system/Assets_category_and_sub_category_master_Report/'+ parts[7] +'/Image/image-download?filepath=/'+partsFilepath[1];   
            var currentUrl = window.location.href;    
          }
        }
      }
      var infowindowContent = 'Asset: ' + currentArray[i]['Asset'] + '<br>' +
      'Chainage: ' + currentArray[i]['Chainage'];

        var infowindow = new google.maps.InfoWindow({
        content: infowindowContent,
        });
        var iconDesign = {
          url: downloadUrl,
          scaledSize: new google.maps.Size(30, 30),
         // anchor: new google.maps.Point(25, 25),
        };
        var AssetMarker = new google.maps.Marker({
          icon: iconDesign,
          animation: google.maps.Animation.DROP,
          position: currentArray[i]['Latlng'],
          map: map,
          });
        

        // Use a closure to capture the correct infowindow for each marker
        (function(infowindow, AssetMarker) {
        // Add event listener for mouseover to open the InfoWindow
        google.maps.event.addListener(AssetMarker, 'mouseover', function() {
        infowindow.open(map, AssetMarker);
        });

        // Add event listener for mouseout to close the InfoWindow
        google.maps.event.addListener(AssetMarker, 'mouseout', function() {
        infowindow.close();
        });
        })(infowindow, AssetMarker);

                RemoveAssetMarker.push(AssetMarker);    
    }
  }
}

function RemovePlottingAssetsMarker() {
//  PrecastBoxCulvertPolyline.setMap(null); 
for (let i = 0; i < RemoveAssetMarker.length; i++) {
  RemoveAssetMarker[i].setMap(null); // Set the map property to null to remove the circle from the map
}
RemoveAssetMarker = []; // Clear the array
}


let DefectsID = document.getElementById("bt-clear");
DefectsID.addEventListener('click', function () {
  // Call the functions to remove plotted defects
  removePlottingDefect();

  // Clear existing options and add 'Select' option for asset group
  var assetGroupSelect = document.getElementById('asset-group-select');
  var assetCategorySelect = document.getElementById('asset-category-select');

  assetGroupSelect.innerHTML = ''; // Clear existing options
  assetCategorySelect.innerHTML = ''; // Clear existing options

  var defaultOptionGroup = document.createElement('option');
  defaultOptionGroup.value = '';
  defaultOptionGroup.innerHTML = 'Select';
  assetGroupSelect.appendChild(defaultOptionGroup);

  var defaultOptionCategory = document.createElement('option');
  defaultOptionCategory.value = '';
  defaultOptionCategory.innerHTML = 'Select';
  assetCategorySelect.appendChild(defaultOptionCategory);

  // Reset select elements
  document.getElementById('category-select').selectedIndex = 0;
  assetGroupSelect.selectedIndex = 0;
  assetCategorySelect.selectedIndex = 0;
  document.getElementById('duration').selectedIndex = 0;

  // Reset checkbox
  document.getElementById('enable-calendar').checked = false;
  toggleDateFields(); // Ensure date fields are disabled

  // Reset date inputs
  document.getElementById('start-date').value = '';
  document.getElementById('end-date').value = '';
});

function toggleDateFields() {
  var isChecked = document.getElementById('enable-calendar').checked;
  document.getElementById('start-date').disabled = !isChecked;
  document.getElementById('end-date').disabled = !isChecked;
}



let ElementID = document.getElementById("workzone");
ElementID.addEventListener('change', function () {
  PlottingWorkzone()
});


// function defectcallbackFunction(category, assetGroup, assetCategory,selectedStartDate,selectedEndDate){
//   console.log(category+" / "+assetGroup);
// }
function defectcallbackFunction(category, assetGroup, assetCategory,selectedStartDate,selectedEndDate)
{
  removePlottingDefect();
  // Remove previously added circles if checkbox is unchecked
  // if (!DefectsID.checked) {
  //   removePlottingDefect();
  //   return;
  // }



// Function to parse custom date format (e.g., "11-Jun-2024")
// Function to parse custom date format (e.g., "11-Jun-2024")
function parseDate(dateStr) {
  const [day, month, year] = dateStr.split('-');
  const months = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  const parsedDate = new Date(year, months[month], day);

  // Format the date as dd-mm-yyyy
  const formattedDate = [
      String(parsedDate.getDate()).padStart(2, '0'),
      String(parsedDate.getMonth() + 1).padStart(2, '0'),  // Months are 0-based
      parsedDate.getFullYear()
  ].join('-');

  return ( parsedDate );
}

 selectedStartDate = parseDate(selectedStartDate);
 selectedEndDate = parseDate(selectedEndDate);
// console.log(selectedStartDate+" / "+selectedEndDate)
 FinalDefect = [];
 for (var i = 0; i < recordArrDefects.length; i++) {
  var defect = recordArrDefects[i];

  // If Static Chainage is null
  if (defect['Static_Chainage'] === '') {
    var chainageFrom = parseFloat(defect['Chainage_From']);
    var chainageTo = parseFloat(defect['Chainage_To']);
    if (!isNaN(chainageFrom) && !isNaN(chainageTo)) {
      // Fetching image source
      var defectImage = [];
      var rectifiedImage;

      if (defect['Image1']) {
        for (var j = 0; j < defect['Image1'].length; j++) {
          if (defect['Image1'][j]['display_value'] !== '') {
            var apiImage = defect['Image1'][j]['display_value'];
            // Split the URL to get the filepath
            var parts = apiImage.split('/');
            var partsFilepath = apiImage.split('?filepath=');
            // Construct the new image download URL
            var downloadUrl = 'https://creatorexport.zoho.in/file/rcidmaplehwmis/highway-maintenance-system/All_Defect_Creations/' + parts[7] + '/Image1.Image/image-download?filepath=/' + partsFilepath[1];
            defectImage.push(downloadUrl);
          }
        }
      }

      if (defect['Defect_Rectification_Image'] && defect['Defect_Rectification_Image'][0] !== undefined) {
        var rectImage = defect['Defect_Rectification_Image'][0]['display_value'];
        // Split the URL to get the filepath
        var rectParts = rectImage.split('/');
        var rectPartsFilepath = rectImage.split('?filepath=');
        // Construct the new image download URL
        rectifiedImage = 'https://creatorexport.zoho.in/file/rcidmaplehwmis/highway-maintenance-system/All_Defect_Creations/' + rectParts[7] + '/Defect_Rectification_Image.Image/image-download?filepath=/' + rectPartsFilepath[1];
      }

      // Calculating Mid Number
      var midChainage = ((chainageFrom + chainageTo) / 2).toFixed(3).replace(/\.?0*$/, '');
      // Creating Temp Array
      var temp = {
        TicketNo: defect['Ticket_No'],
        StaticChainage: '-',
        ChainageFrom: defect['Chainage_From'],
        ChainageTo: defect['Chainage_To'],
        Midchainage: midChainage,
        Side: defect['Level_1']['display_value'],
        Defect: defect['Defect'],
        DefectDescription: defect['Defect1'],
        Quantity: defect['Quantity'],
        DefectImage: defectImage,
        Latlng: [],
        Ticket_Status: defect['Ticket_Status'],
        AddedTime: defect["Added_Time"],
        AssetGroup: defect["Asset_GroupNew"]['display_value'],
        AssetCategory: defect["Asset_CategoryNew"]['display_value'],
        Date_field: defect["Date_field"],
        Road_Section1: defect["Road_Section1"]['display_value'],
        Status: defect["Work_Status"],
        Defect_Rectification_Image: rectifiedImage,
      };
      FinalDefect.push(temp);
    }
  } else if (defect['Static_Chainage'] !== '') {
    var StaticChainage = parseFloat(defect['Static_Chainage']);
    if (!isNaN(StaticChainage)) {
      var defectImage1 = [];
      var rectifiedImage;
      if (defect['Image1']) {
        for (var j = 0; j < defect['Image1'].length; j++) {
          if (defect['Image1'][j]['display_value'] !== '') {
            var apiImage = defect['Image1'][j]['display_value'];
            // Split the URL to get the filepath
            var parts = apiImage.split('/');
            var partsFilepath = apiImage.split('?filepath=');
            // Construct the new image download URL
            var downloadUrl = 'https://creatorexport.zoho.in/file/rcidmaplehwmis/highway-maintenance-system/All_Defect_Creations/' + parts[7] + '/Image1.Image/image-download?filepath=/' + partsFilepath[1];
            defectImage1.push(downloadUrl);
          }
        }
      }
      if (defect['Defect_Rectification_Image'] && defect['Defect_Rectification_Image'][0] !== undefined) {
        var rectImage = defect['Defect_Rectification_Image'][0]['display_value'];
        // Split the URL to get the filepath
        var rectParts = rectImage.split('/');
        var rectPartsFilepath = rectImage.split('?filepath=');
        // Construct the new image download URL
        rectifiedImage = 'https://creatorexport.zoho.in/file/rcidmaplehwmis/highway-maintenance-system/All_Defect_Creations/' + rectParts[7] + '/Defect_Rectification_Image.Image/image-download?filepath=/' + rectPartsFilepath[1];
      }
      // Calculating Mid Number
      var midChainage = ((chainageFrom + chainageTo) / 2).toFixed(3).replace(/\.?0*$/, '');
      // Creating Temp Array
      var temp = {
        TicketNo: defect['Ticket_No'],
        StaticChainage: defect['Static_Chainage'],
        ChainageFrom: defect['Chainage_From'] ? '' : '-',
        ChainageTo: defect['Chainage_To'] ? '' : '-',
        Midchainage: defect['Static_Chainage'],
        Side: defect['Level_1']['display_value'],
        Defect: defect['Defect'],
        DefectDescription: defect['Defect1'],
        Quantity: defect['Quantity'],
        DefectImage: defectImage1,
        Latlng: [],
        Ticket_Status: defect['Ticket_Status'],
        AddedTime: defect["Added_Time"],
        AssetGroup: defect["Asset_GroupNew"]['display_value'],
        AssetCategory: defect["Asset_CategoryNew"]['display_value'],
        Date_field: defect["Date_field"],
        Road_Section1: defect["Road_Section1"]['display_value'],
        Status: defect["Work_Status"],
        Defect_Rectification_Image: rectifiedImage,
      };
      FinalDefect.push(temp);
    }
  }
}


  for(var i = 0 ; i < FinalDefect.length ; i++)
  {
    if(FinalDefect[i]['Side'] != undefined)
    {
      if(FinalDefect[i]['Side'] == 'LHS')
      {
        for(var j = 0 ; j < OffsetLHSLine3Arr.length ; j++)
        {
            if(FinalDefect[i]['Midchainage'] == OffsetLHSLine3Arr[j]['chainage'])
            {
              
              var lat = OffsetLHSLine3Arr[j]['lat'];
              var lng = OffsetLHSLine3Arr[j]['lng']
              FinalDefect[i]['Latlng'] = {lat,lng};
              break;
            }
         }
      }
      else if(FinalDefect[i]['Side'] == 'Median')
      {
        for(var j = 0 ; j < MainCSVArr.length ; j++)
        {
            if(FinalDefect[i]['Midchainage'] == MainCSVArr[j]['chainage'])
            {            
              var lat = MainCSVArr[j]['lat'];
              var lng = MainCSVArr[j]['lng']
              FinalDefect[i]['Latlng'] = {lat,lng};
              break;
            }
         }
      }
      else{    
        for(var j = 0 ; j < OffsetRHSLine3Arr.length ; j++)
         {   
            if(FinalDefect[i]['Midchainage'] == OffsetRHSLine3Arr[j]['chainage'])
            {
              var lat = OffsetRHSLine3Arr[j]['lat'];
              var lng = OffsetRHSLine3Arr[j]['lng'];
              FinalDefect[i]['Latlng'] = {lat,lng};
              break;
            }
         }
       }
     }
  }
  //Marking Defects to Gmap
  // Keep track of the currently open info window
  var currentInfoWindow = null;
      // Function to create a marker icon with a number
      function createMarkerIcon(number, baseIconUrl,callback) {
        const canvas = document.createElement('canvas');
        const size = 40; // Size of the marker icon
        const numberHeight = 20; // Height to accommodate the number above the marker
        canvas.width = size;
        canvas.height = size + numberHeight; // Increase the height to accommodate the number
        const context = canvas.getContext('2d');
      
        // Load the base icon
        const baseImage = new Image();
        baseImage.src = baseIconUrl;
        baseImage.onload = function () {
          // Draw the base icon
          context.drawImage(baseImage, 0, numberHeight, size, size);
      
          // Draw the number above the marker
          context.font = '20px Arial';
          context.fillStyle = '#000000'; // Text color
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(number, size / 2, numberHeight / 2);
      
             // Return the marker icon URL
    callback(canvas.toDataURL());
  };
}
var isValidDefect = false;
var lhsDefectsSideSeps = [];
var rhsDefectsSideSeps = [];
var bhsDefectsSideSeps = [];
for (var i = 0; i < FinalDefect.length; i++) {
  var DefectsSideSep = FinalDefect[i];
  if (DefectsSideSep['AssetGroup'] != undefined && (parseDate(DefectsSideSep['AddedTime'].split(" ")[0])) >= selectedStartDate && (parseDate(DefectsSideSep['AddedTime'].split(" ")[0])) <= selectedEndDate) {
      if (DefectsSideSep.Side === 'LHS') {
          lhsDefectsSideSeps.push(DefectsSideSep);
      } else if (DefectsSideSep.Side === 'RHS') {
          rhsDefectsSideSeps.push(DefectsSideSep);
      } else if (DefectsSideSep.Side === 'BHS' || DefectsSideSep.Side === 'Median') {
          bhsDefectsSideSeps.push(DefectsSideSep);
      }
  }
}
console.log(lhsDefectsSideSeps, rhsDefectsSideSeps, bhsDefectsSideSeps);
var AllArrays = [lhsDefectsSideSeps, rhsDefectsSideSeps, bhsDefectsSideSeps];
for (var initLoop = 0; initLoop < AllArrays.length; initLoop++) {
  console.log(AllArrays[initLoop])
  for (var i = 0; i < AllArrays[initLoop].length; i++) {
  if(assetGroup == 'All'){
    isValidDefect = (AllArrays[initLoop][i]['AssetGroup'] != undefined && AllArrays[initLoop][i]['AssetCategory'] != '' && (parseDate(AllArrays[initLoop][i]['AddedTime'].split(" ")[0])) >= (selectedStartDate) && (parseDate(AllArrays[initLoop][i]['AddedTime'].split(" ")[0])) <= (selectedEndDate))
  }else if(assetGroup != 'All' && assetCategory == 'All'){
    isValidDefect = (AllArrays[initLoop][i]['AssetGroup'] == assetGroup && AllArrays[initLoop][i]['AssetCategory'] != '' && (parseDate(AllArrays[initLoop][i]['AddedTime'].split(" ")[0])) >= (selectedStartDate) && (parseDate(AllArrays[initLoop][i]['AddedTime'].split(" ")[0])) <= (selectedEndDate))
  } else{
    isValidDefect = (AllArrays[initLoop][i]['AssetGroup'] == assetGroup && AllArrays[initLoop][i]['AssetCategory'] == assetCategory && (parseDate(AllArrays[initLoop][i]['AddedTime'].split(" ")[0])) >= (selectedStartDate) && (parseDate(AllArrays[initLoop][i]['AddedTime'].split(" ")[0])) <= (selectedEndDate))
  }
 console.log(isValidDefect)
  if(isValidDefect == true)
  (function (defect) {

    var lat = defect.Latlng['lat'];
    var lng = defect.Latlng['lng'];
    var side = defect.Side;
    console.log("defect1" + side)
    if (!isNaN(lat)) {
      var statusIcon;
      if (defect['Ticket_Status'] == "Open") {
        var isValidDefectFianl = false;
        statusIcon = './Assets/Icons/defect.png';
      var markerCount = 0;
      for (var l = 0; l < AllArrays[initLoop].length; l++) {
        if(AllArrays[initLoop][l]['StaticChainage'] == '-'){
          if(assetGroup == 'All'){
            isValidDefectFianl = (AllArrays[initLoop][l]['Ticket_Status'] == "Open" && AllArrays[initLoop][l]['ChainageFrom'] == defect.ChainageFrom && AllArrays[initLoop][l]['StaticChainage'] == defect.StaticChainage && AllArrays[initLoop][l]['Side'] == side && AllArrays[initLoop][l]['AssetGroup'] != '' && AllArrays[initLoop][l]['AssetCategory'] != '' && (parseDate(AllArrays[initLoop][l]['AddedTime'].split(" ")[0])) >= (selectedStartDate) && (parseDate(AllArrays[initLoop][l]['AddedTime'].split(" ")[0])) <= (selectedEndDate))
          }else if(assetGroup != 'All' && assetCategory == 'All'){
            isValidDefectFianl = (AllArrays[initLoop][l]['Ticket_Status'] == "Open" && AllArrays[initLoop][l]['ChainageFrom'] == defect.ChainageFrom && AllArrays[initLoop][l]['Side'] == side && AllArrays[initLoop][l]['AssetGroup'] == assetGroup && AllArrays[initLoop][l]['AssetCategory'] != '' && (parseDate(AllArrays[initLoop][l]['AddedTime'].split(" ")[0])) >= (selectedStartDate) && (parseDate(AllArrays[initLoop][l]['AddedTime'].split(" ")[0])) <= (selectedEndDate))
          } else{
            isValidDefectFianl = (AllArrays[initLoop][l]['Ticket_Status'] == "Open" && AllArrays[initLoop][l]['ChainageFrom'] == defect.ChainageFrom && AllArrays[initLoop][l]['Side'] == side && AllArrays[initLoop][l]['AssetGroup'] == assetGroup && AllArrays[initLoop][l]['AssetCategory'] == assetCategory && (parseDate(AllArrays[initLoop][l]['AddedTime'].split(" ")[0])) >= (selectedStartDate) && (parseDate(AllArrays[initLoop][l]['AddedTime'].split(" ")[0])) <= (selectedEndDate))
          }
        }else{
          if(assetGroup == 'All'){
            isValidDefectFianl = (AllArrays[initLoop][l]['Ticket_Status'] == "Open" && AllArrays[initLoop][l]['StaticChainage'] == defect.StaticChainage && AllArrays[initLoop][l]['StaticChainage'] == defect.StaticChainage && AllArrays[initLoop][l]['Side'] == side && AllArrays[initLoop][l]['AssetGroup'] != '' && AllArrays[initLoop][l]['AssetCategory'] != '' && (parseDate(AllArrays[initLoop][l]['AddedTime'].split(" ")[0])) >= (selectedStartDate) && (parseDate(AllArrays[initLoop][l]['AddedTime'].split(" ")[0])) <= (selectedEndDate))
          }else if(assetGroup != 'All' && assetCategory == 'All'){
            isValidDefectFianl = (AllArrays[initLoop][l]['Ticket_Status'] == "Open" && AllArrays[initLoop][l]['StaticChainage'] == defect.StaticChainage && AllArrays[initLoop][l]['Side'] == side && AllArrays[initLoop][l]['AssetGroup'] == assetGroup && AllArrays[initLoop][l]['AssetCategory'] != '' && (parseDate(AllArrays[initLoop][l]['AddedTime'].split(" ")[0])) >= (selectedStartDate) && (parseDate(AllArrays[initLoop][l]['AddedTime'].split(" ")[0])) <= (selectedEndDate))
          } else{
            isValidDefectFianl = (AllArrays[initLoop][l]['Ticket_Status'] == "Open" && AllArrays[initLoop][l]['StaticChainage'] == defect.StaticChainage && AllArrays[initLoop][l]['Side'] == side && AllArrays[initLoop][l]['AssetGroup'] == assetGroup && AllArrays[initLoop][l]['AssetCategory'] == assetCategory && (parseDate(AllArrays[initLoop][l]['AddedTime'].split(" ")[0])) >= (selectedStartDate) && (parseDate(AllArrays[initLoop][l]['AddedTime'].split(" ")[0])) <= (selectedEndDate))
          }
        }
        
        if (isValidDefectFianl) {
          markerCount = markerCount + 1;
        }
      }
      
 
      createMarkerIcon(markerCount, statusIcon, function (iconUrl) {
        var marker = new google.maps.Marker({
          icon: {
            url: iconUrl,
            scaledSize: new google.maps.Size(30, 50), // Adjusted size to accommodate number
            // anchor: new google.maps.Point(15, 25), // Adjusted anchor point
          },
          animation: google.maps.Animation.DROP,
          position: { lat, lng },
          map: map,
        });
        
        
        Defectmarker.push(marker);

        marker.addListener('click', function () {
          if (currentInfoWindow) {
            currentInfoWindow.close();
          }
          
          var chainage ;
          if(defect.StaticChainage == '-'){
            chainage = defect.ChainageFrom
          }else{
            chainage = defect.StaticChainage;
          }
          var filtereddefects = FinalDefect.filter(function (defect) {
            // console.log(parseDate(defect['AddedTime'].split(" ")[0]))   
            if(defect.StaticChainage == '-'){    
            if(assetGroup == 'All'){
              return defect.Ticket_Status == "Open" && defect.ChainageFrom === chainage && defect.Side === side && defect.AssetGroup !== '' && defect.AssetCategory !== '' && ((parseDate(defect['AddedTime'].split(" ")[0]))) >= (selectedStartDate) && ((parseDate(defect['AddedTime'].split(" ")[0]))) <= (selectedEndDate);
            }else if(assetGroup != 'All' && assetCategory == 'All'){
              return defect.Ticket_Status == "Open" &&  defect.ChainageFrom === chainage && defect.Side === side && defect.AssetGroup === assetGroup && defect.AssetCategory !== '' && ((parseDate(defect['AddedTime'].split(" ")[0]))) >= (selectedStartDate) && ((parseDate(defect['AddedTime'].split(" ")[0]))) <= (selectedEndDate);
            }else{
              return defect.Ticket_Status == "Open" &&  defect.ChainageFrom === chainage && defect.Side === side && defect.AssetGroup === assetGroup && defect.AssetCategory === assetCategory && ((parseDate(defect['AddedTime'].split(" ")[0]))) >= (selectedStartDate) && ((parseDate(defect['AddedTime'].split(" ")[0]))) <= (selectedEndDate);
            }     
          } else{
            if(assetGroup == 'All'){
              return defect.Ticket_Status == "Open" && defect.StaticChainage === chainage && defect.Side === side && defect.AssetGroup !== '' && defect.AssetCategory !== '' && ((parseDate(defect['AddedTime'].split(" ")[0]))) >= (selectedStartDate) && ((parseDate(defect['AddedTime'].split(" ")[0]))) <= (selectedEndDate);
            }else if(assetGroup != 'All' && assetCategory == 'All'){
              return defect.Ticket_Status == "Open" &&  defect.StaticChainage === chainage && defect.Side === side && defect.AssetGroup === assetGroup && defect.AssetCategory !== '' && ((parseDate(defect['AddedTime'].split(" ")[0]))) >= (selectedStartDate) && ((parseDate(defect['AddedTime'].split(" ")[0]))) <= (selectedEndDate);
            }else{
              return defect.Ticket_Status == "Open" &&  defect.StaticChainage === chainage && defect.Side === side && defect.AssetGroup === assetGroup && defect.AssetCategory === assetCategory && ((parseDate(defect['AddedTime'].split(" ")[0]))) >= (selectedStartDate) && ((parseDate(defect['AddedTime'].split(" ")[0]))) <= (selectedEndDate);
            }  
          }     
          });
         
          
          var contentString = '<div class="custom-info-window" ><h3 class="chainage">Defects at Chainage ' + chainage + '</h3>';// Adding a scrollable container

          filtereddefects.forEach(function (defect, index) {
            contentString += '<div class="defect-details"><h3 class="DefectDetailsHeading">Defect Details</h3>' +
              '<p> <span class="SubmenuStyle"> Ticket No   </span>  : ' + '<b class="listStyle">' + defect.TicketNo + '</b> </p>' +
              '<p> <span class="SubmenuStyle"> Date   </span>  : ' + '<b class="listStyle">' + defect.Date_field + '</b> </p>' +
              '<p> <span class="SubmenuStyle"> Road section   </span>  : ' + '<b class="listStyle">' + defect.Road_Section1+ '</b> </p>' +
              '<p> <span class="SubmenuStyle"> Asset category   </span>  : ' + '<b class="listStyle">' + defect.AssetCategory + '</b> </p>' +
              '<p> <span class="SubmenuStyle"> Marker Chainage   </span>  : ' + '<b class="listStyle">' + defect.Midchainage + '</b> </p>' +
              '<p> <span class="SubmenuStyle"> Side  </span>  : ' + '<b class="listStyle">' + defect.Side + '</b> </p>' ;
              
              if(defect.StaticChainage == '-'){
                contentString +='<p> <span class="SubmenuStyle"> Chainage From   </span>  : ' + '<b class="listStyle">' + defect.ChainageFrom + '</b> </p>' ;
                contentString += '<p> <span class="SubmenuStyle"> Chainage To  </span>  : ' + '<b class="listStyle">' + defect.ChainageTo + '</b> </p>' ;
                }else{
                  contentString += '<p> <span class="SubmenuStyle"> Static Chainage   </span>  : ' + '<b class="listStyle">' + defect.StaticChainage + '</b> </p>' ;
                }
                
              contentString +='<p> <span class="SubmenuStyle"> Defect  </span>  : ' + '<b class="listStyle">' + defect.Defect + '</b> </p>' +
              '<p> <span class="SubmenuStyle"> Defect Description  </span>  : ' + '<b class="listStyle">' + defect.DefectDescription + '</b> </p>'+
              '<p> <span class="SubmenuStyle"> Status  </span>  : ' + '<b class="listStyle">' + defect.Status + '</b> </p>' ;
              

            for (var j = 0; j < defect.DefectImage.length; j++) {
              contentString += '<p> <span class="SubmenuStyle"> Defect Image  </span>: <br><img style="max-width: 100px; max-height: 100px;" src="' + defect.DefectImage[j] + '"></p>';
            }
            contentString += '<p> <span class="SubmenuStyle"> Rectified Image  </span>: <br><img style="max-width: 100px; max-height: 100px;" src="' + defect.Defect_Rectification_Image + '"></p>';
            if (index < filtereddefects.length - 1) {
              contentString += '<hr>';
            }

            contentString += '</div>'; // Closing each defect-details
          });

          contentString += '</div>'; // Closing scrollable container
          contentString += '</div>'; // Closing custom-info-window

          var infowindow = new google.maps.InfoWindow({
            content: contentString,
          });
          
          infowindow.open(map, marker);
          currentInfoWindow = infowindow;
        });
        
      });


      
    }else{
      if (defect['Ticket_Status'] == "Closed") {
        var isValidDefectFianl = false;
        statusIcon = './Assets/Icons/locationGreen.png';
      var markerCount = 0;
      for (var l = 0; l < FinalDefect.length; l++) {
        if(FinalDefect[l]['StaticChainage'] == '-'){
          if(assetGroup == 'All'){
            isValidDefectFianl = (FinalDefect[l]['Ticket_Status'] == "Closed" && FinalDefect[l]['ChainageFrom'] == defect.ChainageFrom && FinalDefect[l]['Side'] == side && FinalDefect[l]['AssetGroup'] != '' && FinalDefect[l]['AssetCategory'] != '' && (parseDate(FinalDefect[l]['AddedTime'].split(" ")[0])) >= (selectedStartDate) && (parseDate(FinalDefect[l]['AddedTime'].split(" ")[0])) <= (selectedEndDate))
          }else if(assetGroup != 'All' && assetCategory == 'All'){
            isValidDefectFianl = (FinalDefect[l]['Ticket_Status'] == "Closed" && FinalDefect[l]['ChainageFrom'] == defect.ChainageFrom && FinalDefect[l]['Side'] == side && FinalDefect[l]['AssetGroup'] == assetGroup && FinalDefect[l]['AssetCategory'] != '' && (parseDate(FinalDefect[l]['AddedTime'].split(" ")[0])) >= (selectedStartDate) && (parseDate(FinalDefect[l]['AddedTime'].split(" ")[0])) <= (selectedEndDate))
          } else{
            isValidDefectFianl = (FinalDefect[l]['Ticket_Status'] == "Closed" && FinalDefect[l]['ChainageFrom'] == defect.ChainageFrom && FinalDefect[l]['Side'] == side && FinalDefect[l]['AssetGroup'] == assetGroup && FinalDefect[l]['AssetCategory'] == assetCategory && (parseDate(FinalDefect[l]['AddedTime'].split(" ")[0])) >= (selectedStartDate) && (parseDate(FinalDefect[l]['AddedTime'].split(" ")[0])) <= (selectedEndDate))
          }
        }else{
          if(assetGroup == 'All'){
            isValidDefectFianl = (FinalDefect[l]['Ticket_Status'] == "Closed" && FinalDefect[l]['StaticChainage'] == defect.StaticChainage && FinalDefect[l]['Side'] == side && FinalDefect[l]['AssetGroup'] != '' && FinalDefect[l]['AssetCategory'] != '' && (parseDate(FinalDefect[l]['AddedTime'].split(" ")[0])) >= (selectedStartDate) && (parseDate(FinalDefect[l]['AddedTime'].split(" ")[0])) <= (selectedEndDate))
          }else if(assetGroup != 'All' && assetCategory == 'All'){
            isValidDefectFianl = (FinalDefect[l]['Ticket_Status'] == "Closed" && FinalDefect[l]['StaticChainage'] == defect.StaticChainage && FinalDefect[l]['Side'] == side && FinalDefect[l]['AssetGroup'] == assetGroup && FinalDefect[l]['AssetCategory'] != '' && (parseDate(FinalDefect[l]['AddedTime'].split(" ")[0])) >= (selectedStartDate) && (parseDate(FinalDefect[l]['AddedTime'].split(" ")[0])) <= (selectedEndDate))
          } else{
            isValidDefectFianl = (FinalDefect[l]['Ticket_Status'] == "Closed" && FinalDefect[l]['StaticChainage'] == defect.StaticChainage && FinalDefect[l]['Side'] == side && FinalDefect[l]['AssetGroup'] == assetGroup && FinalDefect[l]['AssetCategory'] == assetCategory && (parseDate(FinalDefect[l]['AddedTime'].split(" ")[0])) >= (selectedStartDate) && (parseDate(FinalDefect[l]['AddedTime'].split(" ")[0])) <= (selectedEndDate))
          }
        }
     
        if (isValidDefectFianl) {
          markerCount = markerCount + 1;
        }
      }
 
      createMarkerIcon(markerCount, statusIcon, function (iconUrl) {
        var marker = new google.maps.Marker({
          icon: {
            url: iconUrl,
            scaledSize: new google.maps.Size(30, 50), // Adjusted size to accommodate number
            // anchor: new google.maps.Point(15, 25), // Adjusted anchor point
          },
          animation: google.maps.Animation.DROP,
          position: { lat, lng },
          map: map,
        });

        
        Defectmarker.push(marker);

        marker.addListener('click', function () {
          if (currentInfoWindow) {
            currentInfoWindow.close();
          }
          
          var chainage ;
          if(defect.StaticChainage == '-'){
            chainage = defect.ChainageFrom
          }else{
            chainage = defect.StaticChainage;
          }
          var filtereddefects = FinalDefect.filter(function (defect) {
            // console.log(parseDate(defect['AddedTime'].split(" ")[0]))   
            if(defect.StaticChainage == '-'){    
            if(assetGroup == 'All'){
              return defect.Ticket_Status == "Closed" && defect.ChainageFrom === chainage && defect.Side === side && defect.AssetGroup !== '' && defect.AssetCategory !== '' && ((parseDate(defect['AddedTime'].split(" ")[0]))) >= (selectedStartDate) && ((parseDate(defect['AddedTime'].split(" ")[0]))) <= (selectedEndDate);
            }else if(assetGroup != 'All' && assetCategory == 'All'){
              return defect.Ticket_Status == "Closed" &&  defect.ChainageFrom === chainage && defect.Side === side && defect.AssetGroup === assetGroup && defect.AssetCategory !== '' && ((parseDate(defect['AddedTime'].split(" ")[0]))) >= (selectedStartDate) && ((parseDate(defect['AddedTime'].split(" ")[0]))) <= (selectedEndDate);
            }else{
              return defect.Ticket_Status == "Closed" &&  defect.ChainageFrom === chainage && defect.Side === side && defect.AssetGroup === assetGroup && defect.AssetCategory === assetCategory && ((parseDate(defect['AddedTime'].split(" ")[0]))) >= (selectedStartDate) && ((parseDate(defect['AddedTime'].split(" ")[0]))) <= (selectedEndDate);
            }     
          } else{
            if(assetGroup == 'All'){
              return defect.Ticket_Status == "Closed" && defect.StaticChainage === chainage && defect.Side === side && defect.AssetGroup !== '' && defect.AssetCategory !== '' && ((parseDate(defect['AddedTime'].split(" ")[0]))) >= (selectedStartDate) && ((parseDate(defect['AddedTime'].split(" ")[0]))) <= (selectedEndDate);
            }else if(assetGroup != 'All' && assetCategory == 'All'){
              return defect.Ticket_Status == "Closed" &&  defect.StaticChainage === chainage && defect.Side === side && defect.AssetGroup === assetGroup && defect.AssetCategory !== '' && ((parseDate(defect['AddedTime'].split(" ")[0]))) >= (selectedStartDate) && ((parseDate(defect['AddedTime'].split(" ")[0]))) <= (selectedEndDate);
            }else{
              return defect.Ticket_Status == "Closed" &&  defect.StaticChainage === chainage && defect.Side === side && defect.AssetGroup === assetGroup && defect.AssetCategory === assetCategory && ((parseDate(defect['AddedTime'].split(" ")[0]))) >= (selectedStartDate) && ((parseDate(defect['AddedTime'].split(" ")[0]))) <= (selectedEndDate);
            }  
          }     
          });
          

          var contentString = '<div class="custom-info-window"><h3 class="chainage">Defects at Chainage ' + chainage + '</h3>';// Adding a scrollable container

          filtereddefects.forEach(function (defect, index) {
            contentString += '<div class="defect-details"><h3 class="DefectDetailsHeading">Defect Details</h3>' +
              '<p> <span class="SubmenuStyle"> Ticket No   </span>  : ' + '<b class="listStyle">' + defect.TicketNo + '</b> </p>' +
              '<p> <span class="SubmenuStyle"> Date   </span>  : ' + '<b class="listStyle">' + defect.Date_field + '</b> </p>' +
              '<p> <span class="SubmenuStyle"> Road section   </span>  : ' + '<b class="listStyle">' + defect.Road_Section1+ '</b> </p>' +
              '<p> <span class="SubmenuStyle"> Asset category   </span>  : ' + '<b class="listStyle">' + defect.AssetCategory + '</b> </p>' +
              '<p> <span class="SubmenuStyle"> Marker Chainage   </span>  : ' + '<b class="listStyle">' + defect.Midchainage + '</b> </p>' +
              '<p> <span class="SubmenuStyle"> Side  </span>  : ' + '<b class="listStyle">' + defect.Side + '</b> </p>' ;
              
              if(defect.StaticChainage == '-'){
                contentString +='<p> <span class="SubmenuStyle"> Chainage From   </span>  : ' + '<b class="listStyle">' + defect.ChainageFrom + '</b> </p>' ;
                contentString += '<p> <span class="SubmenuStyle"> Chainage To  </span>  : ' + '<b class="listStyle">' + defect.ChainageTo + '</b> </p>' ;
                }else{
                  contentString += '<p> <span class="SubmenuStyle"> Static Chainage   </span>  : ' + '<b class="listStyle">' + defect.StaticChainage + '</b> </p>' ;
                }
                
              contentString +='<p> <span class="SubmenuStyle"> Defect  </span>  : ' + '<b class="listStyle">' + defect.Defect + '</b> </p>' +
              '<p> <span class="SubmenuStyle"> Defect Description  </span>  : ' + '<b class="listStyle">' + defect.DefectDescription + '</b> </p>'+
              '<p> <span class="SubmenuStyle"> Status  </span>  : ' + '<b class="listStyle">' + defect.Status + '</b> </p>' ;
              

            for (var j = 0; j < defect.DefectImage.length; j++) {
              contentString += '<p> <span class="SubmenuStyle"> Defect Image  </span>: <br><img style="max-width: 100px; max-height: 100px;" src="' + defect.DefectImage[j] + '"></p>';
            }
            contentString += '<p> <span class="SubmenuStyle"> Rectified Image  </span>: <br><img style="max-width: 100px; max-height: 100px;" src="' + defect.Defect_Rectification_Image + '"></p>';
            if (index < filtereddefects.length - 1) {
              contentString += '<hr>';
            }

            contentString += '</div>'; // Closing each defect-details
          });

          contentString += '</div>'; // Closing scrollable container
          contentString += '</div>'; // Closing custom-info-window

          var infowindow = new google.maps.InfoWindow({
            content: contentString,
          });
          
          infowindow.open(map, marker);
          currentInfoWindow = infowindow;
        });
      });
    }
    }
  }
  



  })(AllArrays[initLoop][i]);
}
}





}
function removePlottingDefect()
{

  for (let i = 0; i < Defectmarker.length; i++) {
    Defectmarker[i].setMap(null); // Set the map property to null to remove the circle from the map
  }
  Defectmarker = []; // Clear the array
}
function PlottingWorkzone(){
  if (!ElementID.checked) {
    removeWorkzone();
    return;
  }
  var currentInfoWindow = null;
  var CSVSplitWorkzone = recordArrWorkzoneCSV.split('\n');
  for (var i = 0; i < CSVSplitWorkzone.length; i++) {
    const columns = CSVSplitWorkzone[i].split(',');
    const date = (columns[0]);
    const chainage = parseFloat(columns[1]);
    const workDescription = (columns[2]);
    const vendor = (columns[3]);
    if(!isNaN(chainage) && date != '') {
      var temp = {
        date : date,
        chainage : chainage,
        workDescription : workDescription,
        vendor : vendor 
      }
      WorkzoneArr.push(temp);
    } 
  }

  for(var i = 0 ; i < WorkzoneArr.length ; i++){
    var lat,lng;
    for(var j = 0 ; j < MainCSVArr.length ; j++){
      if(MainCSVArr[j]['chainage'] == WorkzoneArr[i]['chainage']){
        lat = MainCSVArr[j]['lat'];
        lng = MainCSVArr[j]['lng']
      }
    }
    var temp = {
      Date : WorkzoneArr[i]['date'],
      chainage : WorkzoneArr[i]['chainage'],
      workDescription : WorkzoneArr[i]['workDescription'],
      vendor : WorkzoneArr[i]['vendor'],
      latlng : {lat,lng}
    }

    var iconDesign = {
      url: './Assets/Icons/workzone.png',
      scaledSize: new google.maps.Size(30, 30),
      anchor: new google.maps.Point(20, 20),
    };

    var marker = new google.maps.Marker({
      icon: iconDesign,
      animation: google.maps.Animation,
      position: { lat, lng },
      map: map,
    });
    WorkzoneMarker.push(marker);
    var contentString = '<div class="custom-info-window"><h3 class="chainage" class="DefectDetailsHeading">Workzone Details</h3>' +
      '<p> <span class="SubmenuStyle"> Date   </span>  : ' + '<b class="listStyle">'+WorkzoneArr[i]['date'] + '</b> </p>' + 
      '<p> <span class="SubmenuStyle"> Chainage   </span>  : ' + '<b class="listStyle">'+ WorkzoneArr[i]['chainage'] + '</b> </p>' + 
      '<p> <span class="SubmenuStyle"> Description  </span>  : ' + '<b class="listStyle">'+WorkzoneArr[i]['workDescription'] + '</b> </p>' + 
      '<p> <span class="SubmenuStyle"> Vendor  </span>  : ' + '<b class="listStyle">'+WorkzoneArr[i]['vendor'] + '</b> </p>' +
      '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString,
    });

    // Use a closure to capture the correct infowindow for each marker
    (function(infowindow, marker) {
      marker.addListener('click', function () {
        // Close the current info window if one is open
        if (currentInfoWindow) {
          currentInfoWindow.close();
        }
        // Open the clicked marker's info window
        infowindow.open(map, marker);
        // Set the current info window to the newly opened info window
        currentInfoWindow = infowindow;
      });
    })(infowindow, marker);
  }
}
function removeWorkzone()
{

  for (let i = 0; i < WorkzoneMarker.length; i++) {
    WorkzoneMarker[i].setMap(null); // Set the map property to null to remove the circle from the map
  }
  WorkzoneMarker = []; // Clear the array
}



// function plotOffsetLines(arr) {
//   var offsetFeatures = [];
//   for (var i = 0; i < arr.length; i += 5) {
//       var coords = arr.slice(i, i + 5).map(function(coord) {
//           return [coord.lng, coord.lat];
//       });
//       if (coords.length >= 2) {
//           var geojson = {
//               "type": "FeatureCollection",
//               "features": [{
//                   "type": "Feature",
//                   "geometry": {
//                       "type": "LineString",
//                       "coordinates": coords
//                   },
//                   "properties": {}
//               }]
//           };
//           var feature = map.data.addGeoJson(geojson, {});
//           offsetFeatures.push(feature); // Store features in offsetFeatures
//       }
//   }
//   console.log(offsetFeatures); // Log the features to the console

//   // Set style for all offset lines
//   offsetFeatures.forEach(function(feature) {
//       map.data.overrideStyle(feature, {
//           strokeColor: 'white',
//           strokeWeight: 1
//       });
//   });
// }