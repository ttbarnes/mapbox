
import { fromJS } from 'immutable';
import pocReducer from '../reducer';

describe('pocReducer', () => {
  it('returns the initial state', () => {
    expect(pocReducer(undefined, {})).toEqual(fromJS({}));
  });
});
