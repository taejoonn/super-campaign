const estimateTaskFunct = require('../../dist/util/managerTools.js').estimateTask;
//const getCampaignLocationsFunct =  require('../../dist/util/managerTools.js').getCampaignLocations;
const assert = require('chai').assert;
const getAvgSpeedFunct = require('../../dist/util/managerTools.js').getAvgSpeed;
const getWorkdayLimitFunct = require('../../dist/util/managerTools.js').getWorkdayLimit;
const createCampaignLocationsFunct = require('../../dist/util/campaignParser.js').createCampaignLocations;
const fs = require('fs');

//tests Locations object in Campaign
describe("CreateCampaignLocations Test", function(){
    let campaignData = {
        campaignName: 'Campaign Name',
        startDate: '1990-02-26',
        endDate: '2018-10-16',
        talkingPoints: 'MY talking points are here \n eishuifhd',
        questionaire: ' Do you like cheese?\r\n Questions are separated by new lines, so even if this isn\'t a good question it\'s okay.\r\n '+
        'Is this a good question?\r\n',
        averageExpectedDuration: '60',
        locations:
                '84, hAMPSHIRE DRIVE, 1, FARMINGDALE, NY, 11735\r\n12, hAMPSHIRE DRIVE, 2,                               FARMINGDALE, NY, 11735\r\n55, hAMPSHIRE DRIVE, 3, FARMINGDALE , NY, 11735',
     canvassers: '1 2 3 1 31 31'
     };
    let campaign =  createCampaignLocationsFunct(campaignData);
    let locationRes = campaign.locations;
    it("Expected Number of locations is 3", function(){
        assert.equal(locationRes.length,3);
    });
    let expectedArr = campaignData['locations'].trim().split("\n");
    for (i in expectedArr) {
        expectedArr[i] = expectedArr[i].replace('\r','');
    }
    //console.log("expected:", expectedArr);
    //console.log(locationRes);
    let idx = 0;
    locationRes.forEach(function(test){
        //console.log(test);
        let expectedField = expectedArr[idx].split(",")
        it('Locations is a proper Locations object', function(){
            assert.typeOf(test,'object');
            assert.property(test,'_streetNumber');
            assert.property(test,'_street')
            assert.property(test,'_unit');
            assert.property(test,'_city');
            assert.property(test,'_state');
            assert.property(test,'_zipcode');
        
        });
         it('Locations has correct streetnum', function(){
             assert.equal(test._streetNumber,expectedField[0].trim());
        });
        it('Locations has correct street', function(){
            assert.equal(test._street,expectedField[1].trim());
       });
        it('Locations has correct unit', function(){
            assert.equal(test._unit,expectedField[2].trim());
       });
       it('Locations has correct city', function(){
        assert.equal(test._city,expectedField[3].trim());
        });
       it('Locations has correct state', function(){
            assert.equal(test._state,expectedField[4].trim());
        });
        it('Locations has correct zipcode', function(){
            assert.equal(test._zipcode,expectedField[5].trim());
        });
        idx++;
    });

})
//tests Global Parameters
describe("Global Parameter [Static] Test", function(){
    let avgSpeed = getAvgSpeedFunct();
    let workday = getWorkdayLimitFunct();
    it("Expected Average Speed to be 25", function(){
        assert.equal(avgSpeed,25);
    });
    it("Expected time limit for workday to be 100", function(){
        assert.equal(workday,100);
    });
});
//Tests EstimateTask Function
// describe("Estimate Task Test", function(){
//     let avgDuration = 60;
//     let travelSpeed = 20;
//     let workdayDuration = 5;
    //let timeTaken = estimateTaskFunct(avgDuration, travelSpeed, workdayDuration);
    //estimateTask = (locations, avgDuration, travelSpeed, workdayDuration) 
    // it("Expected Time for Task is", function(){

    //     assert.equal()
    // })
//})