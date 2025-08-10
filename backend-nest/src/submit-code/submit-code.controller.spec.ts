import { Test, TestingModule } from '@nestjs/testing';
import { SubmitCodeController } from './submit-code.controller';

describe('SubmitCodeController', () => {
  let controller: SubmitCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubmitCodeController],
    }).compile();

    controller = module.get<SubmitCodeController>(SubmitCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
