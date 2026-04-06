---
phase: quick
plan: 260406-jft
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/auth/SignupForm.tsx
autonomous: false
requirements:
  - 이메일 인증 없이 회원가입 즉시 승인
must_haves:
  truths:
    - "회원가입 완료 시 이메일 인증 없이 즉시 로그인 상태가 된다"
    - "가입 후 메인 화면(/)으로 자동 이동한다"
    - "이메일 인증 안내 문구가 사용자에게 노출되지 않는다"
  artifacts:
    - path: "src/components/auth/SignupForm.tsx"
      provides: "가입 즉시 세션 설정 후 리다이렉트"
  key_links:
    - from: "supabase.auth.signUp 응답"
      to: "useAuthStore.setAuth"
      via: "data.session 유무 확인"
      pattern: "setAuth.*data\\.user.*data\\.session"
---

<objective>
이메일 인증 단계를 제거해 회원가입 즉시 앱 사용이 가능하도록 변경한다.

Purpose: 사내 앱 특성상 이메일 인증이 불필요하며, 가입 → 인증 → 로그인의 3단계 흐름이 UX를 저해한다.
Output: 가입 완료 시 즉시 세션이 생성되고 메인 화면으로 이동하는 SignupForm.tsx
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@src/components/auth/SignupForm.tsx
@src/store/useAuthStore.ts
@src/services/supabase.ts
</context>

<tasks>

<task type="checkpoint:human-action" gate="blocking">
  <name>Task 1: Supabase 대시보드에서 이메일 인증 비활성화</name>
  <what-to-do>
    Supabase 대시보드에서 Email Confirmations(이메일 인증)를 비활성화해야 한다.
    이 설정이 꺼져 있어야 signUp() 호출 시 즉시 session이 반환된다.

    설정 경로:
    1. https://supabase.com/dashboard 접속
    2. 프로젝트 선택 (qfvhbabxrurntoxlvuqo)
    3. 왼쪽 메뉴: Authentication > Providers
    4. "Email" 항목 클릭
    5. "Confirm email" 토글을 OFF로 변경
    6. Save 클릭

    확인: "Confirm email" 토글이 비활성화(회색) 상태여야 한다.
  </what-to-do>
  <resume-signal>설정 완료 후 "완료" 또는 "done"을 입력하세요</resume-signal>
</task>

<task type="auto" tdd="false">
  <name>Task 2: SignupForm — 가입 즉시 세션 설정 및 리다이렉트</name>
  <files>src/components/auth/SignupForm.tsx</files>
  <action>
    현재 로직: signUp 성공 → alert(이메일 인증 안내) → /login으로 이동
    변경 로직: signUp 성공 → data.session 확인 → setAuth(user, session) → / 으로 이동

    구체적 변경 사항:
    1. import에 `useAuthStore` 추가: `import { useAuthStore } from '../../store/useAuthStore';`
    2. 컴포넌트 내부에서 setAuth 추출: `const { setAuth } = useAuthStore();`
    3. handleSignup 내 성공 분기를 아래로 교체:

    ```typescript
    // 기존 (삭제)
    alert('회원가입이 완료되었습니다! 이메일로 발송된 인증 링크를 클릭하신 후 로그인해주세요.');
    navigate('/login');

    // 변경 후
    if (data.session) {
      setAuth(data.user, data.session);
      navigate('/');
    } else {
      // 이메일 인증 미비활성화 상태 대비 fallback
      setError('관리자에게 문의해주세요. (이메일 인증 설정 확인 필요)');
      setIsLoading(false);
    }
    ```

    4. `const { error } = await supabase.auth.signUp(...)` →
       `const { data, error } = await supabase.auth.signUp(...)` 로 구조분해 변경

    주의: alert() 호출 완전 제거. 파일 500줄 이하 유지 (현재 108줄, 변경 후 약 115줄 — 문제없음).
  </action>
  <verify>
    <automated>npx tsc --noEmit 2>&1 | head -20</automated>
  </verify>
  <done>
    - 회원가입 성공 시 alert 없이 즉시 / 로 이동
    - useAuthStore에 user, session이 설정되어 로그인 상태 유지
    - TypeScript 타입 오류 없음
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 3: 가입 즉시 로그인 동작 확인</name>
  <what-built>이메일 인증 없는 회원가입 즉시 승인 흐름</what-built>
  <how-to-verify>
    1. `npm run dev` 로 앱 실행 (이미 실행 중이면 생략)
    2. http://localhost:5173/signup 접속
    3. 이름, 이메일, 비밀번호 입력 후 회원가입 버튼 클릭
    4. 기대 동작:
       - alert 팝업 없음
       - 이메일 인증 안내 문구 없음
       - 즉시 / (메인 화면)으로 이동
       - 화면 우상단(또는 해당 위치)에 로그인된 사용자 상태 확인
    5. 브라우저 새로고침 후에도 로그인 상태 유지 확인
  </how-to-verify>
  <resume-signal>"확인" 또는 문제가 있으면 증상을 설명해주세요</resume-signal>
</task>

</tasks>

<verification>
- TypeScript 컴파일 오류 없음: `npx tsc --noEmit`
- signUp 성공 시 data.session이 null이 아닌 경우에만 setAuth 호출
- Supabase 대시보드 "Confirm email" 비활성화 완료
</verification>

<success_criteria>
신규 회원가입 후 이메일 수신함을 확인하지 않아도 즉시 앱을 사용할 수 있다.
가입 → 메인 화면 이동이 단일 흐름으로 완성된다.
</success_criteria>

<output>
완료 후 `.planning/quick/260406-jft-email-verification-skip/260406-jft-SUMMARY.md` 생성
</output>
