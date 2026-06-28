---
layout: post
title: eclipse maven bug 解决方法
author: 陈鑫杰
---

## 关键字
* Could not get the value for parameter compilerId for plugin execution default-compile  
* The operation was cancelled  
* Plugin execution not covered by lifecycle configuration  

## 报错信息

{% highlight java %}
Description	Resource	Path	Location	Type
CoreException: Could not get the value for parameter compilerId for plugin execution default-compile: PluginResolutionException: Plugin org.apache.maven.plugins:maven-compiler-plugin:3.1 or one of its dependencies could not be resolved: The following artifacts could not be resolved: org.apache.maven:maven-artifact:jar:2.0.9, org.apache.maven:maven-core:jar:2.0.9, org.apache.maven:maven-settings:jar:2.0.9, org.apache.maven:maven-plugin-parameter-documenter:jar:2.0.9, org.apache.maven:maven-profile:jar:2.0.9, org.apache.maven:maven-model:jar:2.0.9, org.apache.maven:maven-repository-metadata:jar:2.0.9, org.apache.maven:maven-error-diagnostics:jar:2.0.9, org.apache.maven:maven-project:jar:2.0.9, org.apache.maven:maven-plugin-registry:jar:2.0.9, org.apache.maven:maven-plugin-descriptor:jar:2.0.9, org.apache.maven:maven-artifact-manager:jar:2.0.9, org.apache.maven:maven-monitor:jar:2.0.9, org.apache.maven:maven-toolchain:jar:1.0, org.codehaus.plexus:plexus-container-default:jar:1.5.5, org.codehaus.plexus:plexus-classworlds:jar:2.2.2: Failure to transfer org.apache.maven:maven-artifact:jar:2.0.9 from https://repo.maven.apache.org/maven2 was cached in the local repository, resolution will not be reattempted until the update interval of central has elapsed or updates are forced. Original error: Could not transfer artifact org.apache.maven:maven-artifact:jar:2.0.9 from/to central (https://repo.maven.apache.org/maven2): The operation was cancelled.	pom.xml	/Maven-Test	line 2	Maven Project Build Lifecycle Mapping Problem
CoreException: Could not get the value for parameter compilerId for plugin execution default-testCompile: PluginResolutionException: Plugin org.apache.maven.plugins:maven-compiler-plugin:3.1 or one of its dependencies could not be resolved: The following artifacts could not be resolved: org.apache.maven:maven-artifact:jar:2.0.9, org.apache.maven:maven-core:jar:2.0.9, org.apache.maven:maven-settings:jar:2.0.9, org.apache.maven:maven-plugin-parameter-documenter:jar:2.0.9, org.apache.maven:maven-profile:jar:2.0.9, org.apache.maven:maven-model:jar:2.0.9, org.apache.maven:maven-repository-metadata:jar:2.0.9, org.apache.maven:maven-error-diagnostics:jar:2.0.9, org.apache.maven:maven-project:jar:2.0.9, org.apache.maven:maven-plugin-registry:jar:2.0.9, org.apache.maven:maven-plugin-descriptor:jar:2.0.9, org.apache.maven:maven-artifact-manager:jar:2.0.9, org.apache.maven:maven-monitor:jar:2.0.9, org.apache.maven:maven-toolchain:jar:1.0, org.codehaus.plexus:plexus-container-default:jar:1.5.5, org.codehaus.plexus:plexus-classworlds:jar:2.2.2: Failure to transfer org.apache.maven:maven-artifact:jar:2.0.9 from https://repo.maven.apache.org/maven2 was cached in the local repository, resolution will not be reattempted until the update interval of central has elapsed or updates are forced. Original error: Could not transfer artifact org.apache.maven:maven-artifact:jar:2.0.9 from/to central (https://repo.maven.apache.org/maven2): The operation was cancelled.	pom.xml	/Maven-Test	line 2	Maven Project Build Lifecycle Mapping Problem
Execution default-resources of goal org.apache.maven.plugins:maven-resources-plugin:2.6:resources failed: Plugin org.apache.maven.plugins:maven-resources-plugin:2.6 or one of its dependencies could not be resolved: The following artifacts could not be resolved: org.apache.maven:maven-plugin-api:jar:2.0.6, org.apache.maven:maven-project:jar:2.0.6, org.apache.maven:maven-profile:jar:2.0.6, org.apache.maven:maven-artifact-manager:jar:2.0.6, org.apache.maven:maven-plugin-registry:jar:2.0.6, org.apache.maven:maven-core:jar:2.0.6, org.apache.maven:maven-plugin-parameter-documenter:jar:2.0.6, org.apache.maven:maven-repository-metadata:jar:2.0.6, org.apache.maven:maven-error-diagnostics:jar:2.0.6, org.apache.maven:maven-plugin-descriptor:jar:2.0.6, org.apache.maven:maven-artifact:jar:2.0.6, org.apache.maven:maven-settings:jar:2.0.6, org.apache.maven:maven-model:jar:2.0.6, org.apache.maven:maven-monitor:jar:2.0.6, org.codehaus.plexus:plexus-container-default:jar:1.0-alpha-9-stable-1: Failure to transfer org.apache.maven:maven-plugin-api:jar:2.0.6 from https://repo.maven.apache.org/maven2 was cached in the local repository, resolution will not be reattempted until the update interval of central has elapsed or updates are forced. Original error: Could not transfer artifact org.apache.maven:maven-plugin-api:jar:2.0.6 from/to central (https://repo.maven.apache.org/maven2): The operation was cancelled. (org.apache.maven.plugins:maven-resources-plugin:2.6:resources:default-resources:process-resources)

org.apache.maven.plugin.PluginExecutionException: Execution default-resources of goal org.apache.maven.plugins:maven-resources-plugin:2.6:resources failed: Plugin org.apache.maven.plugins:maven-resources-plugin:2.6 or one of its dependencies could not be resolved: The following artifacts could not be resolved: org.apache.maven:maven-plugin-api:jar:2.0.6, org.apache.maven:maven-project:jar:2.0.6, org.apache.maven:maven-profile:jar:2.0.6, org.apache.maven:maven-artifact-manager:jar:2.0.6, org.apache.maven:maven-plugin-registry:jar:2.0.6, org.apache.maven:maven-core:jar:2.0.6, org.apache.maven:maven-plugin-parameter-documenter:jar:2.0.6, org.apache.maven:maven-repository-metadata:jar:2.0.6, org.apache.maven:maven-error-diagnostics:jar:2.0.6, org.apache.maven:maven-plugin-descriptor:jar:2.0.6, org.apache.maven:maven-artifact:jar:2.0.6, org.apache.maven:maven-settings:jar:2.0.6, org.apache.maven:maven-model:jar:2.0.6, org.apache.maven:maven-monitor:jar:2.0.6, org.codehaus.plexus:plexus-container-default:jar:1.0-alpha-9-stable-1: Failure to transfer org.apache.maven:maven-plugin-api:jar:2.0.6 from https://repo.maven.apache.org/maven2 was cached in the local repository, resolution will not be reattempted until the update interval of central has elapsed or updates are forced. Original error: Could not transfer artifact org.apache.maven:maven-plugin-api:jar:2.0.6 from/to central (https://repo.maven.apache.org/maven2): The operation was cancelled.
	at org.apache.maven.plugin.DefaultBuildPluginManager.executeMojo(DefaultBuildPluginManager.java:106)
	at org.eclipse.m2e.core.internal.embedder.MavenImpl.execute(MavenImpl.java:331)
	at org.eclipse.m2e.core.internal.embedder.MavenImpl$11.call(MavenImpl.java:1362)
	at org.eclipse.m2e.core.internal.embedder.MavenImpl$11.call(MavenImpl.java:1)
	at org.eclipse.m2e.core.internal.embedder.MavenExecutionContext.executeBare(MavenExecutionContext.java:176)
	at org.eclipse.m2e.core.internal.embedder.MavenExecutionContext.execute(MavenExecutionContext.java:112)
	at org.eclipse.m2e.core.internal.embedder.MavenImpl.execute(MavenImpl.java:1360)
	at org.eclipse.m2e.core.project.configurator.MojoExecutionBuildParticipant.build(MojoExecutionBuildParticipant.java:52)
	at org.eclipse.m2e.core.internal.builder.MavenBuilderImpl.build(MavenBuilderImpl.java:137)
	at org.eclipse.m2e.core.internal.builder.MavenBuilder$1.method(MavenBuilder.java:172)
	at org.eclipse.m2e.core.internal.builder.MavenBuilder$1.method(MavenBuilder.java:1)
	at org.eclipse.m2e.core.internal.builder.MavenBuilder$BuildMethod$1$1.call(MavenBuilder.java:115)
	at org.eclipse.m2e.core.internal.embedder.MavenExecutionContext.executeBare(MavenExecutionContext.java:176)
	at org.eclipse.m2e.core.internal.embedder.MavenExecutionContext.execute(MavenExecutionContext.java:112)
	at org.eclipse.m2e.core.internal.builder.MavenBuilder$BuildMethod$1.call(MavenBuilder.java:105)
	at org.eclipse.m2e.core.internal.embedder.MavenExecutionContext.executeBare(MavenExecutionContext.java:176)
	at org.eclipse.m2e.core.internal.embedder.MavenExecutionContext.execute(MavenExecutionContext.java:151)
	at org.eclipse.m2e.core.internal.embedder.MavenExecutionContext.execute(MavenExecutionContext.java:99)
	at org.eclipse.m2e.core.internal.builder.MavenBuilder$BuildMethod.execute(MavenBuilder.java:86)
	at org.eclipse.m2e.core.internal.builder.MavenBuilder.build(MavenBuilder.java:200)
	at org.eclipse.core.internal.events.BuildManager$2.run(BuildManager.java:734)
	at org.eclipse.core.runtime.SafeRunner.run(SafeRunner.java:42)
	at org.eclipse.core.internal.events.BuildManager.basicBuild(BuildManager.java:205)
	at org.eclipse.core.internal.events.BuildManager.basicBuild(BuildManager.java:245)
	at org.eclipse.core.internal.events.BuildManager$1.run(BuildManager.java:300)
	at org.eclipse.core.runtime.SafeRunner.run(SafeRunner.java:42)
	at org.eclipse.core.internal.events.BuildManager.basicBuild(BuildManager.java:303)
	at org.eclipse.core.internal.events.BuildManager.basicBuildLoop(BuildManager.java:359)
	at org.eclipse.core.internal.events.BuildManager.build(BuildManager.java:382)
	at org.eclipse.core.internal.events.AutoBuildJob.doBuild(AutoBuildJob.java:144)
	at org.eclipse.core.internal.events.AutoBuildJob.run(AutoBuildJob.java:235)
	at org.eclipse.core.internal.jobs.Worker.run(Worker.java:55)
Caused by: org.apache.maven.plugin.PluginResolutionException: Plugin org.apache.maven.plugins:maven-resources-plugin:2.6 or one of its dependencies could not be resolved: The following artifacts could not be resolved: org.apache.maven:maven-plugin-api:jar:2.0.6, org.apache.maven:maven-project:jar:2.0.6, org.apache.maven:maven-profile:jar:2.0.6, org.apache.maven:maven-artifact-manager:jar:2.0.6, org.apache.maven:maven-plugin-registry:jar:2.0.6, org.apache.maven:maven-core:jar:2.0.6, org.apache.maven:maven-plugin-parameter-documenter:jar:2.0.6, org.apache.maven:maven-repository-metadata:jar:2.0.6, org.apache.maven:maven-error-diagnostics:jar:2.0.6, org.apache.maven:maven-plugin-descriptor:jar:2.0.6, org.apache.maven:maven-artifact:jar:2.0.6, org.apache.maven:maven-settings:jar:2.0.6, org.apache.maven:maven-model:jar:2.0.6, org.apache.maven:maven-monitor:jar:2.0.6, org.codehaus.plexus:plexus-container-default:jar:1.0-alpha-9-stable-1: Failure to transfer org.apache.maven:maven-plugin-api:jar:2.0.6 from https://repo.maven.apache.org/maven2 was cached in the local repository, resolution will not be reattempted until the update interval of central has elapsed or updates are forced. Original error: Could not transfer artifact org.apache.maven:maven-plugin-api:jar:2.0.6 from/to central (https://repo.maven.apache.org/maven2): The operation was cancelled.
	at org.apache.maven.plugin.internal.DefaultPluginDependenciesResolver.resolveInternal(DefaultPluginDependenciesResolver.java:218)
	at org.apache.maven.plugin.internal.DefaultPluginDependenciesResolver.resolve(DefaultPluginDependenciesResolver.java:149)
	at org.eclipse.m2e.core.internal.project.registry.EclipsePluginDependenciesResolver.resolve(EclipsePluginDependenciesResolver.java:59)
	at org.apache.maven.plugin.internal.DefaultMavenPluginManager.createPluginRealm(DefaultMavenPluginManager.java:422)
	at org.apache.maven.plugin.internal.DefaultMavenPluginManager.setupPluginRealm(DefaultMavenPluginManager.java:385)
	at org.apache.maven.plugin.DefaultBuildPluginManager.getPluginRealm(DefaultBuildPluginManager.java:231)
	at org.apache.maven.plugin.DefaultBuildPluginManager.executeMojo(DefaultBuildPluginManager.java:102)
	... 31 more
Caused by: org.eclipse.aether.resolution.ArtifactResolutionException: The following artifacts could not be resolved: org.apache.maven:maven-plugin-api:jar:2.0.6, org.apache.maven:maven-project:jar:2.0.6, org.apache.maven:maven-profile:jar:2.0.6, org.apache.maven:maven-artifact-manager:jar:2.0.6, org.apache.maven:maven-plugin-registry:jar:2.0.6, org.apache.maven:maven-core:jar:2.0.6, org.apache.maven:maven-plugin-parameter-documenter:jar:2.0.6, org.apache.maven:maven-repository-metadata:jar:2.0.6, org.apache.maven:maven-error-diagnostics:jar:2.0.6, org.apache.maven:maven-plugin-descriptor:jar:2.0.6, org.apache.maven:maven-artifact:jar:2.0.6, org.apache.maven:maven-settings:jar:2.0.6, org.apache.maven:maven-model:jar:2.0.6, org.apache.maven:maven-monitor:jar:2.0.6, org.codehaus.plexus:plexus-container-default:jar:1.0-alpha-9-stable-1: Failure to transfer org.apache.maven:maven-plugin-api:jar:2.0.6 from https://repo.maven.apache.org/maven2 was cached in the local repository, resolution will not be reattempted until the update interval of central has elapsed or updates are forced. Original error: Could not transfer artifact org.apache.maven:maven-plugin-api:jar:2.0.6 from/to central (https://repo.maven.apache.org/maven2): The operation was cancelled.
	at org.eclipse.aether.internal.impl.DefaultArtifactResolver.resolve(DefaultArtifactResolver.java:444)
	at org.eclipse.aether.internal.impl.DefaultArtifactResolver.resolveArtifacts(DefaultArtifactResolver.java:246)
	at org.eclipse.aether.internal.impl.DefaultRepositorySystem.resolveDependencies(DefaultRepositorySystem.java:367)
	at org.apache.maven.plugin.internal.DefaultPluginDependenciesResolver.resolveInternal(DefaultPluginDependenciesResolver.java:210)
	... 37 more
Caused by: org.eclipse.aether.transfer.ArtifactTransferException: Failure to transfer org.apache.maven:maven-plugin-api:jar:2.0.6 from https://repo.maven.apache.org/maven2 was cached in the local repository, resolution will not be reattempted until the update interval of central has elapsed or updates are forced. Original error: Could not transfer artifact org.apache.maven:maven-plugin-api:jar:2.0.6 from/to central (https://repo.maven.apache.org/maven2): The operation was cancelled.
	at org.eclipse.aether.internal.impl.DefaultUpdateCheckManager.newException(DefaultUpdateCheckManager.java:238)
	at org.eclipse.aether.internal.impl.DefaultUpdateCheckManager.checkArtifact(DefaultUpdateCheckManager.java:206)
	at org.eclipse.aether.internal.impl.DefaultArtifactResolver.gatherDownloads(DefaultArtifactResolver.java:585)
	at org.eclipse.aether.internal.impl.DefaultArtifactResolver.performDownloads(DefaultArtifactResolver.java:503)
	at org.eclipse.aether.internal.impl.DefaultArtifactResolver.resolve(DefaultArtifactResolver.java:421)
	... 40 more
	pom.xml	/Maven-Test	line 2	Maven Build Problem
Execution default-testResources of goal org.apache.maven.plugins:maven-resources-plugin:2.6:testResources failed: Plugin org.apache.maven.plugins:maven-resources-plugin:2.6 or one of its dependencies could not be resolved: The following artifacts could not be resolved: org.apache.maven:maven-plugin-api:jar:2.0.6, org.apache.maven:maven-project:jar:2.0.6, org.apache.maven:maven-profile:jar:2.0.6, org.apache.maven:maven-artifact-manager:jar:2.0.6, org.apache.maven:maven-plugin-registry:jar:2.0.6, org.apache.maven:maven-core:jar:2.0.6, org.apache.maven:maven-plugin-parameter-documenter:jar:2.0.6, org.apache.maven:maven-repository-metadata:jar:2.0.6, org.apache.maven:maven-error-diagnostics:jar:2.0.6, org.apache.maven:maven-plugin-descriptor:jar:2.0.6, org.apache.maven:maven-artifact:jar:2.0.6, org.apache.maven:maven-settings:jar:2.0.6, org.apache.maven:maven-model:jar:2.0.6, org.apache.maven:maven-monitor:jar:2.0.6, org.codehaus.plexus:plexus-container-default:jar:1.0-alpha-9-stable-1: Failure to transfer org.apache.maven:maven-plugin-api:jar:2.0.6 from https://repo.maven.apache.org/maven2 was cached in the local repository, resolution will not be reattempted until the update interval of central has elapsed or updates are forced. Original error: Could not transfer artifact org.apache.maven:maven-plugin-api:jar:2.0.6 from/to central (https://repo.maven.apache.org/maven2): The operation was cancelled. (org.apache.maven.plugins:maven-resources-plugin:2.6:testResources:default-testResources:process-test-resources)

org.apache.maven.plugin.PluginExecutionException: Execution default-testResources of goal org.apache.maven.plugins:maven-resources-plugin:2.6:testResources failed: Plugin org.apache.maven.plugins:maven-resources-plugin:2.6 or one of its dependencies could not be resolved: The following artifacts could not be resolved: org.apache.maven:maven-plugin-api:jar:2.0.6, org.apache.maven:maven-project:jar:2.0.6, org.apache.maven:maven-profile:jar:2.0.6, org.apache.maven:maven-artifact-manager:jar:2.0.6, org.apache.maven:maven-plugin-registry:jar:2.0.6, org.apache.maven:maven-core:jar:2.0.6, org.apache.maven:maven-plugin-parameter-documenter:jar:2.0.6, org.apache.maven:maven-repository-metadata:jar:2.0.6, org.apache.maven:maven-error-diagnostics:jar:2.0.6, org.apache.maven:maven-plugin-descriptor:jar:2.0.6, org.apache.maven:maven-artifact:jar:2.0.6, org.apache.maven:maven-settings:jar:2.0.6, org.apache.maven:maven-model:jar:2.0.6, org.apache.maven:maven-monitor:jar:2.0.6, org.codehaus.plexus:plexus-container-default:jar:1.0-alpha-9-stable-1: Failure to transfer org.apache.maven:maven-plugin-api:jar:2.0.6 from https://repo.maven.apache.org/maven2 was cached in the local repository, resolution will not be reattempted until the update interval of central has elapsed or updates are forced. Original error: Could not transfer artifact org.apache.maven:maven-plugin-api:jar:2.0.6 from/to central (https://repo.maven.apache.org/maven2): The operation was cancelled.
	at org.apache.maven.plugin.DefaultBuildPluginManager.executeMojo(DefaultBuildPluginManager.java:106)
	at org.eclipse.m2e.core.internal.embedder.MavenImpl.execute(MavenImpl.java:331)
	at org.eclipse.m2e.core.internal.embedder.MavenImpl$11.call(MavenImpl.java:1362)
	at org.eclipse.m2e.core.internal.embedder.MavenImpl$11.call(MavenImpl.java:1)
	at org.eclipse.m2e.core.internal.embedder.MavenExecutionContext.executeBare(MavenExecutionContext.java:176)
	at org.eclipse.m2e.core.internal.embedder.MavenExecutionContext.execute(MavenExecutionContext.java:112)
	at org.eclipse.m2e.core.internal.embedder.MavenImpl.execute(MavenImpl.java:1360)
	at org.eclipse.m2e.core.project.configurator.MojoExecutionBuildParticipant.build(MojoExecutionBuildParticipant.java:52)
	at org.eclipse.m2e.core.internal.builder.MavenBuilderImpl.build(MavenBuilderImpl.java:137)
	at org.eclipse.m2e.core.internal.builder.MavenBuilder$1.method(MavenBuilder.java:172)
	at org.eclipse.m2e.core.internal.builder.MavenBuilder$1.method(MavenBuilder.java:1)
	at org.eclipse.m2e.core.internal.builder.MavenBuilder$BuildMethod$1$1.call(MavenBuilder.java:115)
	at org.eclipse.m2e.core.internal.embedder.MavenExecutionContext.executeBare(MavenExecutionContext.java:176)
	at org.eclipse.m2e.core.internal.embedder.MavenExecutionContext.execute(MavenExecutionContext.java:112)
	at org.eclipse.m2e.core.internal.builder.MavenBuilder$BuildMethod$1.call(MavenBuilder.java:105)
	at org.eclipse.m2e.core.internal.embedder.MavenExecutionContext.executeBare(MavenExecutionContext.java:176)
	at org.eclipse.m2e.core.internal.embedder.MavenExecutionContext.execute(MavenExecutionContext.java:151)
	at org.eclipse.m2e.core.internal.embedder.MavenExecutionContext.execute(MavenExecutionContext.java:99)
	at org.eclipse.m2e.core.internal.builder.MavenBuilder$BuildMethod.execute(MavenBuilder.java:86)
	at org.eclipse.m2e.core.internal.builder.MavenBuilder.build(MavenBuilder.java:200)
	at org.eclipse.core.internal.events.BuildManager$2.run(BuildManager.java:734)
	at org.eclipse.core.runtime.SafeRunner.run(SafeRunner.java:42)
	at org.eclipse.core.internal.events.BuildManager.basicBuild(BuildManager.java:205)
	at org.eclipse.core.internal.events.BuildManager.basicBuild(BuildManager.java:245)
	at org.eclipse.core.internal.events.BuildManager$1.run(BuildManager.java:300)
	at org.eclipse.core.runtime.SafeRunner.run(SafeRunner.java:42)
	at org.eclipse.core.internal.events.BuildManager.basicBuild(BuildManager.java:303)
	at org.eclipse.core.internal.events.BuildManager.basicBuildLoop(BuildManager.java:359)
	at org.eclipse.core.internal.events.BuildManager.build(BuildManager.java:382)
	at org.eclipse.core.internal.events.AutoBuildJob.doBuild(AutoBuildJob.java:144)
	at org.eclipse.core.internal.events.AutoBuildJob.run(AutoBuildJob.java:235)
	at org.eclipse.core.internal.jobs.Worker.run(Worker.java:55)
Caused by: org.apache.maven.plugin.PluginResolutionException: Plugin org.apache.maven.plugins:maven-resources-plugin:2.6 or one of its dependencies could not be resolved: The following artifacts could not be resolved: org.apache.maven:maven-plugin-api:jar:2.0.6, org.apache.maven:maven-project:jar:2.0.6, org.apache.maven:maven-profile:jar:2.0.6, org.apache.maven:maven-artifact-manager:jar:2.0.6, org.apache.maven:maven-plugin-registry:jar:2.0.6, org.apache.maven:maven-core:jar:2.0.6, org.apache.maven:maven-plugin-parameter-documenter:jar:2.0.6, org.apache.maven:maven-repository-metadata:jar:2.0.6, org.apache.maven:maven-error-diagnostics:jar:2.0.6, org.apache.maven:maven-plugin-descriptor:jar:2.0.6, org.apache.maven:maven-artifact:jar:2.0.6, org.apache.maven:maven-settings:jar:2.0.6, org.apache.maven:maven-model:jar:2.0.6, org.apache.maven:maven-monitor:jar:2.0.6, org.codehaus.plexus:plexus-container-default:jar:1.0-alpha-9-stable-1: Failure to transfer org.apache.maven:maven-plugin-api:jar:2.0.6 from https://repo.maven.apache.org/maven2 was cached in the local repository, resolution will not be reattempted until the update interval of central has elapsed or updates are forced. Original error: Could not transfer artifact org.apache.maven:maven-plugin-api:jar:2.0.6 from/to central (https://repo.maven.apache.org/maven2): The operation was cancelled.
	at org.apache.maven.plugin.internal.DefaultPluginDependenciesResolver.resolveInternal(DefaultPluginDependenciesResolver.java:218)
	at org.apache.maven.plugin.internal.DefaultPluginDependenciesResolver.resolve(DefaultPluginDependenciesResolver.java:149)
	at org.eclipse.m2e.core.internal.project.registry.EclipsePluginDependenciesResolver.resolve(EclipsePluginDependenciesResolver.java:59)
	at org.apache.maven.plugin.internal.DefaultMavenPluginManager.createPluginRealm(DefaultMavenPluginManager.java:422)
	at org.apache.maven.plugin.internal.DefaultMavenPluginManager.setupPluginRealm(DefaultMavenPluginManager.java:385)
	at org.apache.maven.plugin.DefaultBuildPluginManager.getPluginRealm(DefaultBuildPluginManager.java:231)
	at org.apache.maven.plugin.DefaultBuildPluginManager.executeMojo(DefaultBuildPluginManager.java:102)
	... 31 more
Caused by: org.eclipse.aether.resolution.ArtifactResolutionException: The following artifacts could not be resolved: org.apache.maven:maven-plugin-api:jar:2.0.6, org.apache.maven:maven-project:jar:2.0.6, org.apache.maven:maven-profile:jar:2.0.6, org.apache.maven:maven-artifact-manager:jar:2.0.6, org.apache.maven:maven-plugin-registry:jar:2.0.6, org.apache.maven:maven-core:jar:2.0.6, org.apache.maven:maven-plugin-parameter-documenter:jar:2.0.6, org.apache.maven:maven-repository-metadata:jar:2.0.6, org.apache.maven:maven-error-diagnostics:jar:2.0.6, org.apache.maven:maven-plugin-descriptor:jar:2.0.6, org.apache.maven:maven-artifact:jar:2.0.6, org.apache.maven:maven-settings:jar:2.0.6, org.apache.maven:maven-model:jar:2.0.6, org.apache.maven:maven-monitor:jar:2.0.6, org.codehaus.plexus:plexus-container-default:jar:1.0-alpha-9-stable-1: Failure to transfer org.apache.maven:maven-plugin-api:jar:2.0.6 from https://repo.maven.apache.org/maven2 was cached in the local repository, resolution will not be reattempted until the update interval of central has elapsed or updates are forced. Original error: Could not transfer artifact org.apache.maven:maven-plugin-api:jar:2.0.6 from/to central (https://repo.maven.apache.org/maven2): The operation was cancelled.
	at org.eclipse.aether.internal.impl.DefaultArtifactResolver.resolve(DefaultArtifactResolver.java:444)
	at org.eclipse.aether.internal.impl.DefaultArtifactResolver.resolveArtifacts(DefaultArtifactResolver.java:246)
	at org.eclipse.aether.internal.impl.DefaultRepositorySystem.resolveDependencies(DefaultRepositorySystem.java:367)
	at org.apache.maven.plugin.internal.DefaultPluginDependenciesResolver.resolveInternal(DefaultPluginDependenciesResolver.java:210)
	... 37 more
Caused by: org.eclipse.aether.transfer.ArtifactTransferException: Failure to transfer org.apache.maven:maven-plugin-api:jar:2.0.6 from https://repo.maven.apache.org/maven2 was cached in the local repository, resolution will not be reattempted until the update interval of central has elapsed or updates are forced. Original error: Could not transfer artifact org.apache.maven:maven-plugin-api:jar:2.0.6 from/to central (https://repo.maven.apache.org/maven2): The operation was cancelled.
	at org.eclipse.aether.internal.impl.DefaultUpdateCheckManager.newException(DefaultUpdateCheckManager.java:238)
	at org.eclipse.aether.internal.impl.DefaultUpdateCheckManager.checkArtifact(DefaultUpdateCheckManager.java:206)
	at org.eclipse.aether.internal.impl.DefaultArtifactResolver.gatherDownloads(DefaultArtifactResolver.java:585)
	at org.eclipse.aether.internal.impl.DefaultArtifactResolver.performDownloads(DefaultArtifactResolver.java:503)
	at org.eclipse.aether.internal.impl.DefaultArtifactResolver.resolve(DefaultArtifactResolver.java:421)
	... 40 more
	pom.xml	/Maven-Test	line 2	Maven Build Problem
Failure to transfer org.apache.maven:maven-plugin-api:jar:2.0.6 from https://repo.maven.apache.org/maven2 was cached in the local repository, resolution will not be reattempted until the update interval of central has elapsed or updates are forced. Original error: Could not transfer artifact org.apache.maven:maven-plugin-api:jar:2.0.6 from/to central (https://repo.maven.apache.org/maven2): The operation was cancelled.	pom.xml	/Maven-Test	line 1	Maven Configuration Problem
Plugin execution not covered by lifecycle configuration: org.apache.maven.plugins:maven-compiler-plugin:3.1:compile (execution: default-compile, phase: compile)	pom.xml	/Maven-Test	line 2	Maven Project Build Lifecycle Mapping Problem
Plugin execution not covered by lifecycle configuration: org.apache.maven.plugins:maven-compiler-plugin:3.1:testCompile (execution: default-testCompile, phase: test-compile)	pom.xml	/Maven-Test	line 2	Maven Project Build Lifecycle Mapping Problem
{% endhighlight %}

## 处理方式

`cmd` 到工程目录下,运行 `mvn clean install`。  

## 吐槽

这是遇到的*疼的 BUG，起因是安装的时候，网络环境不好。   
偶也是醉了。  
