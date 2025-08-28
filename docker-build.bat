@echo off
echo 🚀 Docker 빌드 시작...

echo 📦 Docker 이미지 빌드 중...
docker build -t laundry-talktalk-frontend . --no-cache

if %errorlevel% equ 0 (
    echo ✅ Docker 이미지 빌드 성공!
    
    echo 🔍 빌드된 이미지 확인:
    docker images | findstr laundry-talktalk-frontend
    
    echo 🏃‍♂️ 컨테이너 실행 중...
    docker run -d -p 3000:3000 --name laundry-frontend laundry-talktalk-frontend
    
    if %errorlevel% equ 0 (
        echo ✅ 컨테이너 실행 성공!
        echo 🌐 애플리케이션이 http://localhost:3000 에서 실행 중입니다.
        echo 📊 헬스체크: http://localhost:3000/api/health
        
        echo 📋 실행 중인 컨테이너:
        docker ps | findstr laundry-frontend
    ) else (
        echo ❌ 컨테이너 실행 실패
        docker logs laundry-frontend 2>nul
    )
) else (
    echo ❌ Docker 이미지 빌드 실패
    exit /b 1
)

echo.
echo 🛠️  유용한 명령어들:
echo 컨테이너 로그 확인: docker logs laundry-frontend
echo 컨테이너 중지: docker stop laundry-frontend
echo 컨테이너 제거: docker rm laundry-frontend
echo 이미지 제거: docker rmi laundry-talktalk-frontend
pause
