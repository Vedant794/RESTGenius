export const data=[
    {
      "projectName": "socialMedia",
      "Port":8000,
      "mongoUri":"mongodb://127.0.0.1:27017/",
      "schemas":[
        {
        "schemaName": "UserProfile",
        "varName": "userProfile",
        "userSelection":['getAllInfo','deleteAllInfo'],
        "attributes": [
          {
            "name": "username",
            "type": "String",
            "dbVarName": "username",
            "isRequired": true,
            "isUnique": true,
            "isIndexed": true,
            "objectAttributes": []
          },
          {
            "name": "email",
            "type": "String",
            "dbVarName": "email",
            "isRequired": true,
            "isUnique": true,
            "isIndexed": true,
            "objectAttributes": []
          },
          {
            "name": "address",
            "type": "Object",
            "dbVarName": null,
            "isRequired": true,
            "isUnique": false,
            "isIndexed": false,
            "objectAttributes": [
              {
                "name": "street",
                "type": "String",
                "objectAttributes": []
              },
              {
                "name": "city",
                "type": "String",
                "objectAttributes": []
              },
              {
                "name": "zipcode",
                "type": "Integer",
                "objectAttributes": []
              },
              {
                "name": "geoLocation",
                "type": "Object",
                "objectAttributes": [
                  {
                    "name": "latitude",
                    "type": "Double",
                    "objectAttributes": []
                  },
                  {
                    "name": "longitude",
                    "type": "Double",
                    "objectAttributes": []
                  }
                ]
              }
            ]
          }
        ]
      
      }]
    }
]