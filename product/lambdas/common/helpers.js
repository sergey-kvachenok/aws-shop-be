import { REGEXP } from '../../../common/constants';

export const isUuidCorrect = uuid => REGEXP.uuid.test(uuid);
