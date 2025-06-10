# 📚 학문 공유 - 전공 공유 플랫폼

![thumb](https://github.com/user-attachments/assets/994c4761-e88e-4a5b-be19-e04ddcc58355)


> 전공자들을 위한 지식 공유 & 소통 게시판 🧑‍🎓  
> 자료 업로드, 댓글, 태그 분류까지! 전공 정보를 함께 나누는 공간

## ⏰ 프로젝트 기간

📅 **시작일** : 2025년 4월 29일 (화)  
📅 **종료일** : 2025년 5월 20일 (화)  
📌 **총 기간** : 22일간의 개발

## 팀원 소개 👨‍👨‍👧‍👧👩‍👦‍👦

|                                백엔드                                 |                                  백엔드                                  |                              프론트엔드                               |                               프론트엔드                                |
| :-------------------------------------------------------------------: | :----------------------------------------------------------------------: | :-------------------------------------------------------------------: | :---------------------------------------------------------------------: |
| <img src="https://github.com/WSIDFY.png" width="100px" alt="김민재"/> | <img src="https://github.com/jay020420.png" width="100px" alt="최지훈"/> | <img src="https://github.com/secgyu.png" width="100px" alt="김규민"/> | <img src="https://github.com/seyounff.png" width="100px" alt="한세윤"/> |
|                  [김민재](https://github.com/WSIDFY)                  |                  [최지훈](https://github.com/jay020420)                  |                  [김규민](https://github.com/secgyu)                  |                  [한세윤](https://github.com/seyounff)                  |

## 💡 주요 기능

### ✅ 회원 기능

- 회원가입 / 로그인 (JWT 인증)
- 닉네임, 프로필 이미지, 전공 설정
- 비밀번호 재설정

### ✅ 게시글 기능

- 게시글 작성 / 수정 / 삭제
- 태그 & 전공 분류별 게시글 필터링
- 이미지/파일 첨부 기능
- 좋아요(추천) 기능
- 커뮤니티 기능

### ✅ 댓글 기능

- 댓글 & 대댓글 작성
- 댓글 좋아요 기능
- 첨부파일 포함 가능
- ai 추천 답변 기능

### ✅ 검색 및 정렬

- 키워드 기반 게시글 검색
- 전공별 필터링
- 최신순 / 인기순 정렬

## 🛠️ 사용 스택

Frontend : React + TypeScript, Zustand, React Query, Tailwind CSS, ky, React Router  
Backend : Node.js + Express, Mongoose, JWT, Bcrypt, Swagger  
Database : MongoDB Atlas  
Deploy : Vercel (프론트), Heroku or Render (백엔드)  
기타 : ESLint, Prettier, Postman, Git, GitHub

## ERD

![ERD](https://github.com/user-attachments/assets/75904f3b-ee22-460d-a501-f6f4cad9d168)


## 📌 스택 아키텍처

![Figma](https://github.com/user-attachments/assets/d4ceedaf-df97-4a0f-b3e9-cb15685bb41b)


## 📆 프로젝트 일정

![Gantt](https://github.com/user-attachments/assets/58b1e26f-1685-4604-a668-46c9c0a8cd2f)


## 🔑 트러블 슈팅 상세 보기

<details markdown="1">
<summary>1.프로필 편집 기능 404 오류</summary>

## 문제상황

프로필 편집 기능을 구현하는 과정에서, API 호출 시 404 오류가 발생하며 프론트엔드와 백엔드 간 연결이 되지 않는 문제가 발생했습니다. 해당 오류는 `PATCH `요청을 보냈음에도 불구하고 백엔드에서 해당 라우트를 찾을 수 없다는 응답이었습니다.

## 원인 분석

처음에는 프론트엔드 코드에서 URL 혹은 요청 방식에 문제가 있다고 판단하고 여러 차례 요청 경로를 점검했지만, 쉽게 원인을 찾을 수 없었습니다. 이때 백엔드에서 엔드포인트가 `/auth/updatedetails`로 설정되어 있음을 알려주셨고, 기존에 제가 사용하던 경로와 다름을 확인할 수 있었습니다

## 해결 과정

백엔드와의 소통을 통해 정확한 API 명세를 재확인한 후, 프론트엔드에서 API 요청 경로를 `/auth/updatedetails`로 수정하고 재요청하자 정상적으로 응답이 이루어졌습니다. 이후 프로필 편집 기능이 성공적으로 구현되었습니다.

</details>

## 📌 향후 계획

- 랭킹 페이지 구현
- 비밀번호 찾기 구현
- 실시간 알림 기능 구현
- 사용자 페이지 평판 구현


배포용 서버는
https://github.com/ExpressTeamProject/Distribute
에서 확인 가능합니다.

RENDER (https://render.com/)을 통한 배포에 최적화 되어있습니다.
