# Moodi

> "어떤 이야기든 다 공감해줄게."

<img width="1440" height="800" alt="moodi" src="https://github.com/user-attachments/assets/15847567-39fc-41d7-af23-e59037e8ffde" />

<br>
<br>
<br>

## 프로젝트 소개

**Moodi**는 GPT-4o 기반의 **공감형 AI 챗봇**입니다.  
어떤 이야기를 해도 무조건 공감해주며, 재치있고 유쾌하게 대화를 이어갑니다.  
진지하거나 무겁지 않게, 친구와 채팅하듯이 자연스럽고 편안한 대화를 제공합니다.

<br>
<br>

## 주요 기능

| 메인 화면 | 채팅 화면 |
| --- | --- |
| <img width="1511" height="855" alt="1" src="https://github.com/user-attachments/assets/3f6fdfa0-bf28-4fd7-a76e-577138df003b" /> | <img width="1511" height="855" alt="2" src="https://github.com/user-attachments/assets/ed7c9022-293c-414d-ae51-9bf7b6a8f1a1" /> |

- **AI 챗봇 대화 기능**: GPT-4o 기반 공감형 대화
- **채팅방 관리**: 생성, 삭제, 이름 수정
- **검색**: 채팅방 목록 검색, 메시지 검색(하이라이트 표시, 스크롤 이동)
- **다크/라이트 모드**: 시스템 설정 기반 모드

<br>
<br>

## 기술 스택

| 분류                  | 기술                           |
| -------------------- | ----------------------------- |
| **Framework**        | Next.js 16 (App Router)       |
| **Library**          | React 19                      |
| **Language**         | TypeScript                    |
| **State Management** | Zustand (persist 미들웨어)      |
| **API**              | OpenAI API (GPT-4o)           |
| **UI Library**       | Tailwind CSS, react-hot-toast, lucide-react |
| **Hosting**          | Vercel                        |

<br>
<br>

## 프로젝트 구조

```
src/
├── app/             # Next.js App Router
│   ├── api/         # API Routes
│   └── chat/        # 채팅 페이지
├── components/      # React 컴포넌트
│   ├── chat/        # 채팅 관련 컴포넌트
│   ├── sidebar/     # 사이드바 컴포넌트
│   └── intro/       # 인트로 페이지 컴포넌트
├── stores/          # Zustand 상태 관리
├── hooks/           # 커스텀 훅
├── types/           # TypeScript 타입 정의
├── utils/           # 유틸리티 함수
└── styles/          # 전역 스타일
```
