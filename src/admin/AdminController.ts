import { Controller } from '@nestjs/common';

export function AdminController(path?: string): ClassDecorator {
  return Controller(`admin/${path}`);
}
