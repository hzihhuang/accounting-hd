import { Controller } from '@nestjs/common';

export function WebController(path?: string): ClassDecorator {
  return Controller(`web/${path}`);
}
