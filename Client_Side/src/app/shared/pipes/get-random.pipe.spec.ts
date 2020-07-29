import { GetRandomPipe } from './get-random.pipe';

describe('GetRandomPipe', () => {
  it('create an instance', () => {
    const pipe = new GetRandomPipe();
    expect(pipe).toBeTruthy();
  });
});
