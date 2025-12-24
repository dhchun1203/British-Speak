#!/usr/bin/env node

/**
 * Supabase 연동 확인 스크립트
 * 
 * 사용법: node scripts/check-supabase.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Supabase 연동 확인 중...\n');

// .env.local 파일 확인
const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local 파일을 찾을 수 없습니다!');
  console.log('   프로젝트 루트에 .env.local 파일을 생성하세요.\n');
  process.exit(1);
}

console.log('✅ .env.local 파일이 존재합니다.\n');

// 환경 변수 읽기
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// 필수 환경 변수 확인
const requiredVars = {
  'NEXT_PUBLIC_SUPABASE_URL': 'Supabase Project URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'Supabase Anon Key',
  'SUPABASE_SERVICE_ROLE_KEY': 'Supabase Service Role Key'
};

console.log('📋 환경 변수 확인:\n');

let allPresent = true;

Object.entries(requiredVars).forEach(([key, description]) => {
  const value = envVars[key];
  
  if (!value) {
    console.log(`❌ ${key} - 설정되지 않음`);
    console.log(`   ${description}을(를) .env.local 파일에 추가하세요.\n`);
    allPresent = false;
  } else if (value.includes('your_') || value.includes('here')) {
    console.log(`⚠️  ${key} - 플레이스홀더 값이 발견됨`);
    console.log(`   실제 ${description} 값으로 변경하세요.\n`);
    allPresent = false;
  } else {
    // 값의 일부만 표시 (보안)
    const preview = value.length > 20 
      ? `${value.substring(0, 20)}...` 
      : value;
    console.log(`✅ ${key}`);
    console.log(`   ${description}: ${preview}\n`);
  }
});

if (!allPresent) {
  console.log('⚠️  일부 환경 변수가 설정되지 않았거나 플레이스홀더 값입니다.');
  console.log('   docs/SUPABASE_SETUP.md 파일을 참고하여 설정하세요.\n');
  process.exit(1);
}

console.log('✅ 모든 필수 환경 변수가 설정되었습니다!\n');
console.log('다음 단계:');
console.log('1. 개발 서버 실행: npm run dev');
console.log('2. 브라우저에서 http://localhost:3000/gallery 접속');
console.log('3. docs/SUPABASE_CONNECTION_CHECK.md 참고하여 추가 확인\n');













