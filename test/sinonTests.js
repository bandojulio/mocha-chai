'use strict';

var chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect;
chai.should();

describe('sinon tests', function(){
    var student, schedule;

    beforeEach(function(){
        student = {
            dropClass: function(classId, callback){
                if(!!callback.dropClass){
                    callback.dropClass();
                } else {
                    callback();
                }
            },
            addClass: function(schedule){
                if(!schedule.classIsFull()){
                    return true;
                } else {
                    return false;
                }
            }
        };

        schedule = {
            dropClass: function(){
                console.log('class dropped');
            },
            classIsFull: function(){
                return true;
            }
        };
    });

    describe('student.dropClass', function(){
        it('should call the callback', function(){
            // spy here is a dummy function called as a callback
            var spy = sinon.spy();

            student.dropClass(1, spy);
            spy.called.should.be.true;
        });

        it('should call the callback and log to the console', function(){
            function onClassDropped(){
                console.log("onClassDropped was called");
            }
            // spy can receive a function to execute when it is called
            var spy = sinon.spy(onClassDropped);

            student.dropClass(1, spy);
            spy.called.should.be.true;
        });

        it('should call the callback even if it\'s a method of an object', function(){
            // you can change a object 'schedule' to contain a spy
            sinon.spy(schedule, 'dropClass');
            student.dropClass(1, schedule);
            schedule.dropClass.called.should.be.true;
        });
    });

    describe('student with stubs', function(){
        it('should call a stubbed method', function(){
            var stub = sinon.stub(schedule);
            student.dropClass(1, stub);
            stub.dropClass.called.should.be.true;
        });

        it('should return true when the class is not full', function(){
            // In this example stub default value will be replaced with the returns
            var stub = sinon.stub(schedule);
            stub.classIsFull.returns(false);

            var returnVal = student.addClass(stub);
            returnVal.should.be.true;
        });
    });

    describe('student with mocks', function(){
        it('mocks schedule', function(){
            // mock an object
            var mockObj = sinon.mock(schedule);
            // expects that mockObj will be called once
            var expectation = mockObj.expects('classIsFull').once();

            // call object of mock once
            student.addClass(schedule);
            expectation.verify();
        });
    });
});