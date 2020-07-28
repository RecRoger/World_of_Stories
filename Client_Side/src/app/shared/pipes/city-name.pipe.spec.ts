import { CityNamePipe } from './city-name.pipe';

describe('CityNamePipe', () => {
  it('create an instance', () => {
    const pipe = new CityNamePipe();
    expect(pipe).toBeTruthy();
  });
});
