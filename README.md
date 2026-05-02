#feature
- <b>Admin</b> Dashboard for admin can update status each of disaster report for show users / approve report each of user reported
- <b>User</b> can view all report or near location of user stay for news update about disaster / report disaster for public news

#expectations
- implement with many sensors in real forest location for detect and show realtime status of heating and use many sensing in real location for analyze to determine between hot spot or wildfire

## this docker-compose.yml
```
services:
  web:
    build: ./report_disaster
    ports:
      - "5000:3000"
    volumes:
      - ./report_disaster:/app
      - /app/node_modules
    env_file:
      - ./report_disaster/.env
    environment:
      - CHOKIDAR_USEPOLLING=true
      - WATCHPACK_POLLING=true
    command: npm run dev
    depends_on:
      - db
    
  db:
    image: postgres:16
    restart: always
    env_file:
      - ./report_disaster/.env
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: disaster
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
volumes:
  db_data:
```
Image show preview of web application<br>
![alt text](https://i.ibb.co/fGV1gxWm/disaster-report.png)
![alt text](https://i.ibb.co/bkBDnQ8/disaster-report4.png)
![alt text](https://i.ibb.co/mVXbtFjF/disaster-report5.png)
![alt text](https://i.ibb.co/mCTfpmRj/disaster-report3.png)


