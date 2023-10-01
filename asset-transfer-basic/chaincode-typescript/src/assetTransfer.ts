/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Deterministic JSON.stringify()
import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import {Asset} from './asset';

import axios from 'axios';


@Info({title: 'AssetTransfer', description: 'Smart contract for trading assets'})
export class AssetTransferContract extends Contract {

    @Transaction()
    public async InitLedger(ctx: Context): Promise<void> {

        const assets: Asset[] = [
            {ID:"ZFF75VFA4F0568999",Make:"Dodge",Model:"Durango",Year:2002,Owner:"Koch Inc",AppraisedValue:37374},
            {ID:"5UXWX9C55F0775600",Make:"Plymouth",Model:"Neon",Year:2000,Owner:"Torp-Schultz",AppraisedValue:156837},
            {ID:"1C4RDHDG9EC756661",Make:"Hummer",Model:"H1",Year:2003,Owner:"Schaden-Wolf",AppraisedValue:347705},
            {ID:"4F2CY0C74BK131969",Make:"Infiniti",Model:"EX",Year:2009,Owner:"Veum, Von and Hirthe",AppraisedValue:191936},
            {ID:"JTHBW1GG6D2577253",Make:"Hyundai",Model:"Accent",Year:2010,Owner:"Paucek and Sons",AppraisedValue:161588},
            {ID:"KNAFT4A23D5651086",Make:"Acura",Model:"Integra",Year:1992,Owner:"Yundt-Rice",AppraisedValue:435357},
            {ID:"1FTEW1CM7EF694891",Make:"Dodge",Model:"Stealth",Year:1996,Owner:"Windler-Friesen",AppraisedValue:153573},
            {ID:"3VW8S7AT6FM437969",Make:"Audi",Model:"A4",Year:2001,Owner:"Marquardt Inc",AppraisedValue:384953},
            {ID:"5N1AR2MMXEC941296",Make:"Ford",Model:"Escort",Year:1985,Owner:"Pfannerstill, Rowe and Roob",AppraisedValue:220131},
            {ID:"WVWED7AJ2BW059402",Make:"BMW",Model:"5 Series",Year:2001,Owner:"Erdman-Kohler",AppraisedValue:434162},
            {ID:"JM3ER2A50B0876210",Make:"Ford",Model:"Explorer",Year:1991,Owner:"Beatty and Sons",AppraisedValue:392457},
            {ID:"2C4RDGCG9ER602809",Make:"Volkswagen",Model:"Jetta",Year:2003,Owner:"DuBuque and Sons",AppraisedValue:396879},
            {ID:"WBSWL9C51AP235294",Make:"Toyota",Model:"Camry",Year:1994,Owner:"Hilpert Inc",AppraisedValue:451119},
            {ID:"KM8NU4CC7AU670965",Make:"Buick",Model:"Century",Year:2003,Owner:"Kunde, Bahringer and Kassulke",AppraisedValue:192005},
            {ID:"3FADP0L39CR086146",Make:"Chevrolet",Model:"Cavalier",Year:2000,Owner:"Jenkins, Wiza and Glover",AppraisedValue:206718},
            {ID:"WBANE73516C578636",Make:"Ford",Model:"E250",Year:2005,Owner:"Schiller-Hamill",AppraisedValue:40413},
            {ID:"WAUBFAFL8DA892414",Make:"Jeep",Model:"Liberty",Year:2005,Owner:"D'Amore, Donnelly and Hegmann",AppraisedValue:184448},
            {ID:"1D4PU5GK7AW501122",Make:"Toyota",Model:"Land Cruiser",Year:2000,Owner:"Torphy and Sons",AppraisedValue:407921},
            {ID:"1GD12ZCG8CF213416",Make:"Nissan",Model:"Altima",Year:1993,Owner:"Fay-Gislason",AppraisedValue:149168},
            {ID:"1FTSX2B57AE918760",Make:"Eagle",Model:"Talon",Year:1998,Owner:"Marquardt Group",AppraisedValue:135895},
        ]
        
        // const assets: Asset[] = [
        //     {
        //         ID: 'asset1',
        //         Color: 'blue',
        //         Size: 5,
        //         Owner: 'Tomoko',
        //         Coordinates: {latitude: -37.3159, longitude: 81.1496},
        //         AppraisedValue: 300,
        //     },
        //     {
        //         ID: 'asset2',
        //         Color: 'red',
        //         Size: 5,
        //         Owner: 'Brad',
        //         Coordinates: {latitude: -43.9509, longitude: -34.4618},
        //         AppraisedValue: 400,
        //     },
        //     {
        //         ID: 'asset3',
        //         Color: 'green',
        //         Size: 10,
        //         Owner: 'Jin Soo',
        //         Coordinates: {latitude: -68.6102, longitude: -47.0653},
        //         AppraisedValue: 500,
        //     },
        //     {
        //         ID: 'asset4',
        //         Color: 'yellow',
        //         Size: 10,
        //         Owner: 'Max',
        //         Coordinates: {latitude: 29.4572, longitude: -164.2990},
        //         AppraisedValue: 600,
        //     },
        //     {
        //         ID: 'asset5',
        //         Color: 'black',
        //         Size: 15,
        //         Owner: 'Adriana',
        //         Coordinates: {latitude: -31.8129, longitude: 62.5342},
        //         AppraisedValue: 700,
        //     },
        //     {
        //         ID: 'asset6',
        //         Color: 'white',
        //         Size: 15,
        //         Owner: 'Michel',
        //         Coordinates: {latitude: -71.4197, longitude: 71.7478},
        //         AppraisedValue: 800,
        //     },
        // ];

        
        

        for (const asset of assets) {
            asset.docType = 'asset';
            // example of how to write to world state deterministically
            // use convetion of alphabetic order
            // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
            // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
            await ctx.stub.putState(asset.ID, Buffer.from(stringify(sortKeysRecursive(asset))));
            console.info(`Asset ${asset.ID} initialized`);
            
            
        }
    }

    // CreateAsset issues a new asset to the world state with given details.
    @Transaction()
    // public async CreateAsset(ctx: Context, vin: string, make: string, model: string, year: number, owner: string, location: string, weather: number, latitude: number, longitude: number, appraisedValue: number): Promise<void> {
    public async CreateAsset(ctx: Context, args: string): Promise<void> {
        const newAsset = JSON.parse(args);
        const exists = await this.AssetExists(ctx, newAsset.ID);
        if (exists) {
            throw new Error(`The asset ${newAsset.ID} already exists`);
        }

        const asset = {
            ID: newAsset.ID,
            Make: newAsset.Make,
            Model: newAsset.Model,
            Year: newAsset.Year,
            Owner: newAsset.Owner,
            Location: newAsset.Location,
            Weather: newAsset.Weather,
            Coordinates: {latitude: newAsset.Latitude, longitude: newAsset.Longitude},
            AppraisedValue: newAsset.AppraisedValue,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(newAsset.ID, Buffer.from(stringify(sortKeysRecursive(asset))));
    }

    // ReadAsset returns the asset stored in the world state with given id.
    @Transaction(false)
    public async ReadAsset(ctx: Context, id: string): Promise<string> {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    // UpdateAsset updates an existing asset in the world state with provided parameters.
    @Transaction()
    public async UpdateAsset(ctx: Context, vin: string, make: string, model: string, year: Date, owner: string, location: string, weather: number, latitude: number, longitude: number, appraisedValue: number): Promise<void> {
        const exists = await this.AssetExists(ctx, vin);
        if (!exists) {
            throw new Error(`The asset ${vin} does not exist`);
        }

        // overwriting original asset with new asset
        const updatedAsset = {
            ID: vin,
            Make: make,
            Model: model,
            Year: year,
            Owner: owner,
            Location: location,
            Weather: weather,
            Coordinates: {latitude: latitude, longitude: longitude},
            AppraisedValue: appraisedValue,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(vin, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
    }

    // DeleteAsset deletes an given asset from the world state.
    @Transaction()
    public async DeleteAsset(ctx: Context, id: string): Promise<void> {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // AssetExists returns true when asset with given ID exists in world state.
    @Transaction(false)
    @Returns('boolean')
    public async AssetExists(ctx: Context, id: string): Promise<boolean> {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    // TransferAsset updates the owner field of asset with given id in the world state, and returns the old owner.
    @Transaction()
    public async TransferAsset(ctx: Context, id: string, newOwner: string): Promise<string> {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        const oldOwner = asset.Owner;
        asset.Owner = newOwner;
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
        return oldOwner;
    }

    // UpdateLocation updates the coordinates field of asset with given new coordinates, and returns the old owner.
    @Transaction()
    public async UpdateLocation(ctx: Context, id: string): Promise<string> {
        
        
        
       



       
        
      
        try {
            const URL = `https://my.api.mockaroo.com/weather_location.json?latitude=16.7136708&longitude=103.3125299`;
            const response = await axios.get(URL, {
                headers: {
                    // 'application/json' is the modern content-type for JSON, but some
                    // older servers may use 'text/json'.
                    // See: http://bit.ly/text-json
                    'x-api-key': '795eb1c0',
                    'content-type': 'text/json'
                  },
            //   params: {
                
            //     count: 1,
                
            //   },
            });
      
            if (response.status === 200) {
            //   return response.data;
                const assetString = await this.ReadAsset(ctx, id);
                const asset = JSON.parse(assetString);


                asset.Humidity = response.data.weather.humidity; 
                asset.Temperature = response.data.weather.temperature;
                asset.Latitude = response.data.coordinates.latitude;
                asset.Longitude = response.data.coordinates.longitude;

                await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
                return asset;


            } else {
              throw new Error(`Failed to fetch data from Mockaroo API: ${response.statusText}`);
            }
        } catch (error) {
            throw new Error(`Error connecting to Mockaroo API: ${error}`);
        }
        






        // call the oracle with new coordinates
        // const weatherConditionsString = await this.GetWeatherConditions(ctx, latitude, longitude);

        // const weatherConditions = JSON.parse(weatherConditionsString)
        // const weatherConditionsString='{"humidity":57,"temperature":49.99,"weather_description":"elit ac nulla sed vel enim sit amet nunc viverra dapibus nulla suscipit ligula in"}'
        
        // const URL = `https://my.api.mockaroo.com/weather_location.json?latitude=16.7136708&longitude=103.3125299`;
        // const URL = `http://127.0.0.1:3000/fetchWeather`;
        // const URL = `https://jsonplaceholder.typicode.com/users/10`;

        // Create a request to the weather API.
        // const request = new Request(URL);
        // Create a request to the weather API.
        // const request = new Request(URL, {
        //     method: 'GET',
        //     headers:{
        //         'x-api-key': API_KEY,
        //         'User-Agent' : 'My-App',
        //         'Accept': '*/*',
        //     },
            
            
        // });

        // const response = await fetch(`https://my.api.mockaroo.com/weather_location.json?latitude=16.7136708&longitude=103.3125299`, {
        //     method: 'GET',
        //     headers: {
        //         'content-type': 'application/json;charset=UTF-8',
        //         "X-API-KEY": API_KEY,
        //     },
        // });

        // if (!response.ok) {
        //     throw new Error(`Error! status: ${response.status}`);
        // }

    




        // Make the request to the weather API.
        // const response = await fetch(request);
        // Check the status code of the response.
        // if (response.status !== 200) {
        //     throw new Error('Error getting weather: ' + response.status);
        // }
         // Get the weather data from the response body.
        // const weatherConditions = await response.json();
        // const weatherConditions = JSON.parse(weatherConditionsString);


        // const txt = typeof(weatherConditions.weather.temperature)
        // throw new Error(`Error! weatherCOndition: ${txt}`);
        

        //   get from oracle
        // asset.Humidity = weatherConditions.weather.humidity; 
        // if(response.ok){
        //     asset.Temperature = +weatherConditions.weather.temperature;

        // }
        // const latitude = "16.7136708";
        // const longitude = "103.3125299";

        // asset.Latitude = latitude; 
        // asset.Longitude = longitude;

        // asset.Longitude = +weatherConditions.address.geo.lng;
        // asset.Latitude = +weatherConditions.address.geo.lat;

        // asset.Humidity = weatherConditions.weather.humidity; 
        // asset.Temperature = weatherConditions.weather.temperature;
        // asset.Latitude = +weatherConditions.coordinates.latitude;
        // asset.Longitude = +weatherConditions.coordinates.longitude;

        
        // const oldAsset = asset.Coordinates;
        // update weather code.  
        // Temperature 1 (1-10), 2 (11-20), 3 (21-30), 4 (31-45), 5 (46-60)
        // Humidity 2 (90-100)

        // decrease the apprisal value 1% if code 1, 2, 5 (vehicle has been exposed to extrem conditions)

          // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        //   await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
        //   return asset;
    }

    @Transaction()
    @Returns('string')
    public async GetWeatherConditions(ctx: Context, latitude: string, longitude: string): Promise<string> {
        const API_KEY = '795eb1c0';
        // const URL = `https://my.api.mockaroo.com/weather_location.json?latitude=${latitude}&longitude=${longitude}`;
        const URL = 'http://127.0.0.1:3000/fetchWeather';

        // const URL = `https://jsonplaceholder.typicode.com/users/10`;

        // Create a request to the weather API.
        // const request = new Request(URL, {
        //     method: 'GET',
        //     // headers:{
        //     //     "x-api-key": API_KEY,
        //     // },
            
            
        // });

         // Create a request to the weather API.
        const request = new Request(URL);

        // Make the request to the weather API.
        const response = await fetch(request);


        // Check the status code of the response.
        if (response.status !== 200) {
            throw new Error('Error getting weather: ' + response.status);
        }

        // const allResults = [];
        // // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        // const iterator = await ctx.stub.getStateByRange('', '');
        // let result = await iterator.next();
        // while (!result.done) {
        //     const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
        //     let record;
        //     try {
        //         record = JSON.parse(strValue);
        //     } catch (err) {
        //         console.log(err);
        //         record = strValue;
        //     }
        //     allResults.push(record);
        //     result = await iterator.next();
        // }
        // return JSON.stringify(allResults);


        // Get the weather data from the response body.
        const assets = await response.json();


        // Return the weather data.
        // return weatherData;

        // asset.Coordinates.longitude = +newCoordinates.address.geo.lng;
        // asset.Coordinates.latitude = +newCoordinates.address.geo.lat;

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        // await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(assets))));
        // return oldCoordinates;

        return JSON.stringify(assets);
    }

    // TransferAsset updates the owner field of asset with given id in the world state, and returns the old owner.
    @Transaction()
    public async InvokeOracle(ctx: Context, id: string): Promise<string> {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        const oldCoordinates = asset.Coordinates;

        const url = `https://jsonplaceholder.typicode.com/users/10`;
        

        // Create a request to the weather API.
        const request = new Request(url);

        // Make the request to the weather API.
        const response = await fetch(request);

        // Check the status code of the response.
        if (response.status !== 200) {
            throw new Error('Error getting weather: ' + response.status);
        }

        // Get the weather data from the response body.
        const newCoordinates = await response.json();

        // Return the weather data.
        // return weatherData;

        asset.Coordinates.longitude = +newCoordinates.address.geo.lng;
        asset.Coordinates.latitude = +newCoordinates.address.geo.lat;

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
        return oldCoordinates;
    }



    // GetAllAssets returns all assets found in the world state.
    @Transaction(false)
    @Returns('string')
    public async GetAllAssets(ctx: Context): Promise<string> {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

}
