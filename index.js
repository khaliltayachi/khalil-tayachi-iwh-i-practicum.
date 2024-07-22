const express = require('express');
const axios = require('axios');
const app = express();
const PRIVATE_APP_ACCESS = 'pat-eu1-ab061ffa-58c8-4aa2-ae5c-d417254f6370'; // Replace with your private app access token

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Custom Object Endpoint
const CRM_RECORDS_ENDPOINT = 'https://api.hubapi.com/crm/v3/objects/pcs?properties=pctype,pcweight,pcprice'
;

// Route for rendering the updates form
app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});

// Route for handling form submissions
app.post('/update-cobj', async (req, res) => {
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    const data = {
        properties: {
            pctype: req.body.pctype,
            pcweight: req.body.pcweight,
            pcprice: req.body.pcprice
        }
    };
    try {
        await axios.post(CRM_RECORDS_ENDPOINT, data, { headers });
        res.redirect('/');  // Redirect to the homepage after creating the CRM record
    } catch (error) {
        console.error('Error creating CRM record:', error.response ? error.response.data : error.message);
        res.status(500).send('Error creating custom object record.');
    }
});

// Route for rendering the homepage
app.get('/', async (req, res) => {
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`
    };
    try {
        const response = await axios.get(CRM_RECORDS_ENDPOINT, { headers });

        // Log the entire response to check the structure
        console.log('API Response:', JSON.stringify(response.data, null, 2));

        // Ensure response.data.results exists and is an array
        if (response.data.results && Array.isArray(response.data.results)) {
            const pcRecords = response.data.results.map(record => ({
                properties: {
                    pctype: record.properties.pctype,
                    pcweight: record.properties.pcweight,
                    pcprice: record.properties.pcprice
                }
            }));

            console.log('Mapped Records:', JSON.stringify(pcRecords, null, 2));

            res.render('homepage', {
                title: 'Pc\'s',
                records: pcRecords
            });
        } else {
            console.error('Unexpected API response format:', response.data);
            res.status(500).send('Error retrieving CRM records.');
        }
    } catch (error) {
        console.error('Error retrieving CRM records:', error.response ? error.response.data : error.message);
        res.status(500).send('Error retrieving CRM records.');
    }
});

// Start the server
app.listen(3000, () => console.log('Listening on http://localhost:3000'));


// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});


app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/