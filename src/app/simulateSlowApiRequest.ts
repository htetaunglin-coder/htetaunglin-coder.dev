export function simulateSlowApiRequest(data: string, delay: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
}
