const expect = require('chai').expect;
const rewire = require('rewire');

const tree = rewire('../lib/roblox-tree');

describe('Roblox-based hierarchy constructing', function() {
  describe('getName()', function() {
    let getName;

    before(function() {
      getName = tree.__get__('getName');
    });

    it('should return the first part of a dot-separated file name', function() {
      expect(getName('file.separated.by.dots.lua')).to.equal('file');
    });

    it('works with directories', function() {
      expect(getName('/path/to/file.separated.by.dots.lua')).to.equal('file');
    });
  });
  
  describe('getScriptClassFromWord()', function() {
    let getClassNameFromKeyword;

    before(function() {
      getClassNameFromKeyword = tree.__get__('getClassNameFromKeyword');
    });
    
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
    let getClassKeyword;

    before(function() {
      getClassKeyword = tree.__get__('getClassKeyword');
    });

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
    let getClassName;
    
    before(function() {
      getClassName = tree.__get__('getClassName');
    })
    
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
