import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const INCREMENT = 60;

export default function usePartialRender(totalElements: number) {
  const { ref, inView } = useInView({ rootMargin: '800px' });
  const [maxToRender, updateRendered] = useState(INCREMENT);

  useEffect(() => {
    if (inView && totalElements > maxToRender) {
      updateRendered(maxToRender => maxToRender + INCREMENT);
    }
  }, [inView]);

  useEffect(() => {
    if (totalElements > INCREMENT) {
      updateRendered(INCREMENT);
    }
  }, [totalElements]);

  return { maxToRender, triggerRef: ref };
}
