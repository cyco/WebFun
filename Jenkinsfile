pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile.CI'
            args  '--network=infrastructure_internal --link infrastructure_sonarqube_1:sonarqube \
                   -v /var/jenkins_home:/var/jenkins_home:rw,z'
        }
    }
	options { timestamps() }
	stages {
		stage("Install dependencies") {
            steps {
                sh 'yarn install --frozen-lockfile --non-interactive --offline'
            }
		}

		stage("Build") {
			environment {
			    YODA_DATA = credentials('YODA_DATA')
			}
			steps {
				sh "ci=1 yarn build"
			}
		}

		stage("Test") {
            steps {
                sh 'ci=1 yarn test:full'
            }
		}

        stage("Collect metrics") {
            steps {
                script {
                    def scannerHome = tool 'SonarQube Scanner';
                    withSonarQubeEnv('sonar') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
	}

    post {
        always {
            archiveArtifacts artifacts: 'build/*', fingerprint: true
        }
    }
}
