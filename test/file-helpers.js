const expect = require('chai').expect;
const path = require('path');

const fileHelpers = require('../lib/file-helpers');

describe('File helpers', function() {
  let mockfs;

  before(function() {
    mockfs = require('mock-fs');

    mockfs({
      '/path/to': {
        'sample-dir': {},
        'sample-file.txt': 'Hello, World!'
      }
    });
  });

  after(function() {
    mockfs.restore();
  });
  
  describe('isDirectory', function() {
    const isDirectory = fileHelpers.isDirectory;
    
    it('should return true when given a directory', function() {
      expect(isDirectory('/path/to/sample-dir')).to.be.true;
    });

    it('should return false when given anything else', function() {
      expect(isDirectory('/path/to/sample-file.txt')).to.be.false;
    });
  });

  describe('getFileContents', function() {
    const getFileContents = fileHelpers.getFileContents;
    
    it('should return the contents of a file', function() {
      expect(getFileContents('/path/to/sample-file.txt')).to.equal('Hello, World!')
    });

    it('should fail when given a directory', function() {
      expect(getFileContents.bind('/path/to/sample-dir')).to.throw();
    });
  });

  describe('getName()', function() {
    const getName = fileHelpers.getName;

    it('should return the first part of a dot-separated file name', function() {
      expect(getName('file.separated.by.dots.lua')).to.equal('file');
    });

    it('works with directories', function() {
      expect(getName('/path/to/file.separated.by.dots.lua')).to.equal('file');
    });
  });
});
