---
to: src/modules/<%= h.changeCase.lcFirst(name) %>/index.js
---

import <%= name %>Controller from './controller';
import <%= name %>Service from './service';
import <%= name %>Entity from './entity';

export { <%= name %>Controller, <%= name %>Service, <%= name %>Entity };
