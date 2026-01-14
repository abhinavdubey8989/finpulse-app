
- Similar to form page to add expense, create another form for adding an expense category
- it should have 3 mandatory feilds: 
        - category (string of length 4 minimum)
        - description (string of length 4 minimum)
        - monthly upper limit (integer, no decimals allowed)
- Request & response of the API to add the category is shown below
- Pass the JWT access token from local storage, which is stored at the time of login, along with userId
- When API response is 2xx, redirect to add expense page/form
- Keep the UI design & look & feel similar to existing UI design

```
curl --location 'http://localhost:8055/api/v1/user/550e8400-e29b-41d4-a716-446655440000/expense-category' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6ImFiaGluYXZAZXhhbXBsZS5jb20iLCJuYW1lIjoiQWJoaW5hdiIsImlhdCI6MTc2ODI4MDcwMCwiZXhwIjoxNzY4MzY3MTAwfQ.64mQVtZ5LbmzdW26UrJ6jtQEkpIAIsgNQRe4qqzg4nc' \
--header 'Content-Type: application/json' \
--header 'Cookie: JSESSIONID=0FB20C64A99D8F00910A11A5ADB83E8E' \
--data '{
    "category": "travel",
    "monthlyUpperLimit": 100,
    "description": "Travelling yayy"
}'
```

```
{
    "apiData": {
        "id": "ace5bdae-546b-4740-ba08-f4f9aa7f5908"
    },
    "respId": ""
}
```