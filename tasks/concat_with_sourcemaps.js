/*
 * grunt-concat-with-sourcemaps
 * Concatenate files and combine their source maps into one file
 *
 * Copyright (c) 2015 Michael Wohlfahrter
 * Licensed under the MIT license
 */

'use strict';

module.exports = function (grunt) {

    var Concat = require('concat-with-sourcemaps');

    grunt.registerMultiTask('concat_with_sourcemaps', 'Concatenate files and combine their source maps into 1 file', function () {
        var options = this.options({
            separator: grunt.util.linefeed,
            sourceRoot: ''
        });

        this.files.forEach(function (f) {
            var destinationFileName = f.dest.split('/').pop();
            var concat = new Concat(true, destinationFileName, '\n');

            var filePaths = f.src.filter(function (filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });

            var i, j;
            for (i = 0; i < filePaths.length; i++) {
                var filename = filePaths[i];
                var fileSrc = grunt.file.read(filename);

                var mappedFileName = filename;
                var sourceFileContent = '';
                var sourceMapContent = '';

                var fileArray = fileSrc.split('\n');
                for (j = 0; j < fileArray.length - 1; j++) {
                    fileArray[j] += '\n';
                }
                fileArray.map(function(line) {
                    if (/\/\/[@#]\s+sourceMappingURL=(.+)/.test(line) || /\/\*#\s+sourceMappingURL=([^\s]+)\s+\*\//.test(line)) {
                        var sourceMapPath = filename.replace(/[^\/]*$/, RegExp.$1);
                        sourceMapContent = JSON.parse(grunt.file.read(sourceMapPath));
                        if(sourceMapContent.sources.length == 1) {
                            mappedFileName = sourceMapContent.sourceRoot + sourceMapContent.sources[0];
                        }
                        mappedFileName = mappedFileName.replace(/\.\.\//g, '');
                        sourceMapContent.sourceRoot = options.sourceRoot;
                        sourceMapContent.sources[0] = mappedFileName;
                        return '';
                    }
                    sourceFileContent += line;
                    return line;
                });
                sourceFileContent += options.separator;
                concat.add(mappedFileName, sourceFileContent, sourceMapContent);
            }

            grunt.file.write(f.dest, concat.content + '\n//# sourceMappingURL=' + destinationFileName + '.map');
            grunt.file.write(f.dest + '.map', concat.sourceMap);
            grunt.log.writeln('Files created: "' + f.dest + '" and "' + f.dest + '.map"');
        });
    });

};
