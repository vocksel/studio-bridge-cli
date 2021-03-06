const expect = require('chai').expect;

const className = require('../lib/className');

describe('ClassName parsing', function() {
  describe('getScriptClassFromWord()', function() {
    const getClassNameFromKeyword = className.getClassNameFromKeyword;
    
    it('should return `ModuleScript` for `module`', function() {
      expect(getClassNameFromKeyword('module')).to.equal('ModuleScript')
    });
    
    it('should return `LocalScript` for `local`', function() {
      expect(getClassNameFromKeyword('local')).to.equal('LocalScript');
    });
    
    it('should return `Script` for `script`', function() {
      expect(getClassNameFromKeyword('script')).to.equal('Script');
    });
  });
  
  describe('getClassId()', function() {
    const getClassKeyword = className.getClassKeyword;
    
    it('should match the first part to the left of the extension', function() {
      expect(getClassKeyword('file.with.many.other.parts.classId.lua')).to.equal('classId')
    });
    
    it('should match from right to left', function() {      
      expect(getClassKeyword('file.anotherPart.classId.lua')).to.equal('classId');
      expect(getClassKeyword('file.classId.anotherPart.lua')).to.not.equal('classId');
    });
    
    it('should not match the name of the file as the class ID', function() {
      expect(getClassKeyword('file.classId.lua')).to.not.equal('file');
    });
    
    it('should not match the extension as the class ID', function() {
      expect(getClassKeyword('file.classId.lua')).to.not.equal('lua');
    });
    
    it('should default to `script` when dealing with Lua files', function() {
      expect(getClassKeyword('file.lua')).to.equal('script');
    });
  });
  
  describe('getClassName()', function() {
    const getClassName = className.getClassName;

    it('should return ModuleScript for `module`', function() {
      const path = '/path/to/file.module.lua';
      expect(getClassName(path)).to.equal('ModuleScript');
    });
    
    it('should return LocalScript for `local`', function() {
      const path = '/path/to/file.local.lua';
      expect(getClassName(path)).to.equal('LocalScript');
    });
    
    it('should return `Script` for everything else', function() {
      const path1 = '/path/to/file.script.lua';
      const path2 = '/path/to/file.lua';
      
      expect(getClassName(path1)).to.equal('Script');
      expect(getClassName(path2)).to.equal('Script');
    })
  });
});
