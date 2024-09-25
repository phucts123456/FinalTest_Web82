1.How to get data in Frontend app:
- First you need to login with login api (/api/v1/user/login)
- After login success get access token returned from app and paste it to token variable at FinalTest_Web82\FinalTest_Web82_FE\api\axiosInstance.js line 12
- Then return to FE app at "/" to see the result.

2. How to get default account
- When the BE app started, it with automatically create an account with password, username setting in env file.
- You can run /api/v1/user/registDefaultUser if the process above fail.
