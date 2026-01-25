

- Similar to form page to add expense, create another form for adding an expense group
- it should have 3 mandatory feilds: 
        - name (string of length 4 minimum)
        - description (string of length 4 minimum)
        - Members (which is a drop down to select multiple user to this group)

- For Members, display the memeber-name as chips, if user taps, the chip will be selected & all selected Ids will be passed as `memberUserIds`
- Request & response of the API to add the category is shown below
- Pass the JWT access token from local storage, which is stored at the time of login, along with userId
- When API response is 2xx, redirect to add expense page
- Keep the UI design & look & feel similar to existing UI design


=== Create group API request/response ===
```
curl --location 'http://localhost:8055/api/v1/group' \
--header 'Authorization: Bearer <access-token>' \
--header 'Content-Type: application/json' \
--header 'Cookie: JSESSIONID=DAF964CBF3BBAEC42FD92790B1048B13' \
--data '{
    "createdBy": "550e8400-e29b-41d4-a716-446655440000",
    "name": "house-hold",
    "description": "house-hold expenses",
    "memberUserIds": [
        "d33a3a27-8cbd-41e1-afd1-efa7760a7ced"
    ]
}'
```

```
{
    "apiData": {
        "failedMemberIds": [],
        "id": "2aa24d8c-f998-42f2-8f87-61780066fa30"
    },
    "respId": ""
}
```


=== Configure group API request/response ===

```
curl --location 'http://localhost:8055/api/v1/group/550e8400-e29b-41d4-a716-446655440000/configure' \
--header 'Authorization: Bearer <access-token>' \
--header 'Cookie: JSESSIONID=34C4EEE833F899987CB99CFA7BB3FECE'
```


```
{
    "apiData": {
        "users": [
            {
                "emailId": "abhinav@example.com",
                "name": "Abhinav",
                "userId": "550e8400-e29b-41d4-a716-446655440000"
            },
            {
                "emailId": "maitry@example.com",
                "name": "Maitry",
                "userId": "d33a3a27-8cbd-41e1-afd1-efa7760a7ced"
            }
        ]
    },
    "respId": ""
}
```