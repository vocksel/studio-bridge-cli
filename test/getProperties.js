const rewire = require('rewire')
const pascalCase = require('pascal-case');
const expect = require('chai').expect;
const mockfs = require('mock-fs');

const getFileContents = require('../lib/fileHelpers').getFileContents;
const getProperties = rewire('../lib/getProperties');

describe('Getting Roblox properties from files', function() {
  describe('getFolderProperties()', function() {
    let getFolderProperties;

    before(function() {
      getFolderProperties = getProperties.__get__('getFolderProperties');

      mockfs({
        '/folder': {}
      });
    });

    after(function() {
      mockfs.restore();
    })

    it('should return an Object', function() {
      expect(getFolderProperties('/folder'))
    });

    it('should have each key is written in PascalCase', function() {
      for (key in getFolderProperties('/folder')) {
        expect(key).to.equal(pascalCase(key))
      }
    });

    it('should have a `Name` property', function() {
      expect(getFolderProperties('/folder')).to.have.property('Name');
    });

    it('should have a `ClassName` property', function() {
      expect(getFolderProperties('/folder')).to.have.property('ClassName');
    });
  });

  describe('getLuaFileProperties()', function() {
    let getLuaFileProperties;

    before(function() {
      getLuaFileProperties = getProperties.__get__('getLuaFileProperties');

      mockfs({
        '/file.lua': 'print("Hello, World!")'
      });
    });

    after(function() {
      mockfs.restore();
    });

    it('should return an Object', function() {
      expect(getLuaFileProperties('/file.lua'))
    });

    it('should have each key is written in PascalCase', function() {
      for (key in getLuaFileProperties('/file.lua')) {
        expect(key).to.equal(pascalCase(key))
      }
    });

    it('should have a `Name` property', function() {
      expect(getLuaFileProperties('/file.lua')).to.have.property('Name');
    });

    it('should have a `ClassName` property', function() {
      expect(getLuaFileProperties('/file.lua')).to.have.property('ClassName');
    });

    it('should have a `Source` property', function() {
      expect(getLuaFileProperties('/file.lua')).to.have.property('Source');
    });

    it('should have the same `Source` property and file contents', function() {
      const content = getFileContents('/file.lua');
      const props = getLuaFileProperties('/file.lua');

      expect(props['Source']).to.equal(content);
    });
  });

  describe('getJsonFileProperties()', function() {
    let getJsonFileProperties;

    before(function() {
      getJsonFileProperties = getProperties.__get__('getJsonFileProperties');

      mockfs({
        '/good.json': '{ "ClassName": "Sound", "SoundId": "1", "Volume": 0.5 }',

        '/bad.json': '{ "BadClassName": "Test" }',

        // Needs the ClassName property so that it doesn't return null
        // immediately.
        '/not-pascal-case.json': '{ "not_pascal_case": "true" }'
      });
    });

    after(function() {
      mockfs.restore();
    });

    it('should return an Object', function() {
      expect(getJsonFileProperties('/good.json'))
    });

    it('should have a `Name` property', function() {
      expect(getJsonFileProperties('/good.json')).to.have.property('Name');
    });

    it('should return null when no `ClassName` property is supplied', function() {
      expect(getJsonFileProperties('/bad.json')).to.be.null;
    });

    // it('should error when all its properties are not in PascalCase', function() {
    //   expect(() => getJsonFileProperties('/not-pascal-case.json')).to.throw();
    // });
  });


  describe('getFileProperties()', function() {
    it('should route files with `.lua` extensions to getLuaFileProperties()');

    it('should route files with `.json` extensions to getJsonFileProperties()');
  });

  describe('getProperties()', function() {
    it('should route folders to getFolderProperties()');

    it('should route files to getFileProperties()');
  });
});
