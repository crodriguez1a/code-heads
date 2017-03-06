import * as gulp from 'gulp';
import transpile from './transpile';
import processMarkup from './process-markup';
import processSASS from './process-sass';
import copyFiles from './copy-files';
import {build} from 'aurelia-cli';
import * as project from '../aurelia.json';

export default gulp.series(
  readProjectConfiguration,
  gulp.parallel(
    transpile,
    processMarkup,
    processSASS,
    copyFiles
  ),
  writeBundles
);

function readProjectConfiguration() {
  return build.src(project);
}

function writeBundles() {
  return build.dest();
}
