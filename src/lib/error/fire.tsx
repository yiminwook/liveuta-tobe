//에러테스트용

import { useState } from 'react';
import { clientAxios } from '@/lib/api/axios-client'

export const typeErrorAPI = async () => {
  const { data } = await clientAxios.get<unknown[]>('/api/v1/test')
  return data.map(() => '');
};

export default function Fire({ label = '에러 테스트' }: { label?: string }) {
  const [fire, setFire] = useState(false);

  // if (process.env.NODE_ENV === 'production') {
  //   console.log('빌드 에러테스트!!!', fire);
  //   throw new Error('에러테스트!!!');
  // }

  if (fire) throw new Error('에러테스트!!!');

  return (
    <div
      style={{ backgroundColor: 'red', color: 'white', padding: '1rem' }}
      onClick={() => setFire(true)}
    >
      {label}
    </div>
  );
}
