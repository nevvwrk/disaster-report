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


