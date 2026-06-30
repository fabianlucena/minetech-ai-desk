const dependencies = new Map();

export function getDependency(name) {
  let dependency = dependencies.get(name);
  if (!dependency)
    throw new Error(`No existe la dependencia con el nombre ${name}`);

  if (typeof dependency === 'function')
    dependency = dependency();

  return dependency;
}

export default getDependency;

export function addDependency(name, dependency) {
  if (dependencies.has(name)) {
    throw new Error(`Dependency with name ${name} already exists`);
  }
  
  dependencies.set(name, dependency);
}