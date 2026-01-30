
import { FRAMEWORKS } from './frameworks';
import { PERSONAS } from './personas';
import { COMPASS } from './compass';
import { RegistryItem } from './types';

export const MASTER_REGISTRY: RegistryItem[] = [...FRAMEWORKS, ...PERSONAS, ...COMPASS];
export { COURSE_BLUEPRINT } from './blueprint';
